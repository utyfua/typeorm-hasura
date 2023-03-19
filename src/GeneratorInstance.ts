import * as TypeORM from "typeorm";
import * as Hasura from "./MetadataV3";

export interface CustomDataSourceOptions {
    name: string;
    dataSource: TypeORM.DataSource;
    customization?: Hasura.SourceCustomization;
}

function getHasuraKind(type: TypeORM.DataSourceOptions["type"]): Hasura.Source["kind"] {
    switch (type) {
        case "postgres":
            return "postgres";
        default:
            throw new Error(`Unsupported data source type ${type}.`);
    }
}

export class TypeormHasuraMetadataGenerator {
    dataSources: CustomDataSourceOptions[];
    constructor(dataSources: CustomDataSourceOptions[]) {
        this.dataSources = dataSources;

        // check all dataSources are initialized otherwise throw error
        dataSources.forEach(dataSource => {
            if (!dataSource.dataSource.isInitialized) {
                throw new Error(`Data source ${dataSource.name} is not initialized`);
            }
        });
    }

    getDatabaseUrl(dataSource: TypeORM.DataSource): Hasura.PostgresConfiguration['connection_info']['database_url'] {
        const { options } = dataSource;
        // check for postgres
        if (options.type !== "postgres") {
            throw new Error(`Unsupported data source type ${options.type}.`);
        }
        if ('url' in options) {
            return options.url
        }
        if (typeof options.password !== 'string') {
            throw new Error(`Does not support password as a function.`);
        }
        return {
            username: options.username,
            password: options.password,
            database: options.database,
            host: options.host,
            port: options.port?.toString(),
        }
    }

    generateSource(options: CustomDataSourceOptions): Hasura.Source {
        console.log(options);

        return {
            name: options.name,
            kind: getHasuraKind(options.dataSource.options.type),
            tables: [...options.dataSource.entityMetadatas].reverse().map(metadata => this.generateTable(metadata)),
            customization: options.customization,
            configuration: {
                "connection_info": {
                    "database_url": this.getDatabaseUrl(options.dataSource),
                    "isolation_level": "read-committed",
                    "use_prepared_statements": false
                },
                "extensions_schema": "extensions_schema_test"
            }
        }
    }

    generateTable(table: TypeORM.EntityMetadata): Hasura.MetadataTable {
        console.log(table);
        return {
            table: {
                name: table.tableName,
                schema: table.schema,
            },
            object_relationships: [],
            array_relationships: [],
            insert_permissions: [],
            select_permissions: [],
            update_permissions: [],
            delete_permissions: [],
        }
    }

}

export function generateHasuraMetadata(typeormSources: CustomDataSourceOptions[] | CustomDataSourceOptions): Hasura.Metadata {
    if (!Array.isArray(typeormSources)) {
        typeormSources = [typeormSources];
    }

    const generator = new TypeormHasuraMetadataGenerator(typeormSources);

    return {
        resource_version: 0,
        metadata: {
            version: 3,
            sources: typeormSources.map(typeormSources => generator.generateSource(typeormSources))
            // backend_configs?: BackendConfigs;
            // remote_schemas?: RemoteSchema[];
            // actions?: Action[];
            // query_collections?: QueryCollection[];
            // allowlist?: AllowList[];
            // inherited_roles?: InheritedRole[];
            // custom_types?: CustomTypes;
            // cron_triggers?: CronTrigger[];
            // network?: Network;
            // rest_endpoints?: RestEndpoint[];
            // api_limits?: ApiLimits;
            // graphql_schema_introspection?: GraphQLSchemaIntrospection;

            /**
             * The EE Lite OpenTelemetry settings.
             *
             * ATTENTION: Both Lux and the EE Lite server allow configuring OpenTelemetry. Anyway, this only
             * represents the EE Lite one since Lux stores the OpenTelemetry settings by itself.
             */
            // opentelemetry?: OpenTelemetry;
        }
    }
}
