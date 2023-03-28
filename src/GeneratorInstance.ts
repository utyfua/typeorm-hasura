import { CustomDataSourceOptions } from "./types";
import * as Hasura from "./MetadataV3";
import { generateSource } from "./mappers";

export class TypeormHasuraMetadataGenerator {
    private _metadata: Hasura.Metadata;

    constructor() {
        this._metadata = {
            resource_version: 0,
            metadata: {
                version: 3,
                sources: []
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

    /**
     * Adds a source to the metadata.
     */
    addSource(sourceOptions: CustomDataSourceOptions) {
        const source = generateSource(sourceOptions);
        this._metadata.metadata.sources.push(source)
        return this;
    }

    /**
     * Adds multiple sources to the metadata.
     */
    addSources(sourceOptions: CustomDataSourceOptions[]) {
        sourceOptions.forEach(sourceOptions => this.addSource(sourceOptions));
        return this;
    }

    /**
     * Returns the metadata.
     * 
     * @note This method is not async because we might need to do some async stuff in the future.
     */
    getMetadata(): Hasura.Metadata | Promise<Hasura.Metadata> {
        return this._metadata;
    }
}
