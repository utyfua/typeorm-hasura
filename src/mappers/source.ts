import { DataSourceOptions } from "../types";
import * as Hasura from "../MetadataV3";
import { getHasuraKind } from "./hasuraKind";
import { getDatabaseUrl } from "./databaseUrl";
import { generateTable } from "./table";

export function generateSource(dataSourceOptions: DataSourceOptions): Hasura.Source {
    let { name, dataSource, customizationNative: customization } = dataSourceOptions;

    // customization ??= {}
    // customization.naming_convention ??= 'graphql-default'

    return {
        name,
        kind: getHasuraKind(dataSource.options.type),
        tables: [...dataSource.entityMetadatas]
            .reverse()
            .map(table => generateTable(dataSourceOptions, table)),
        customization,
        configuration: {
            "connection_info": {
                "database_url": getDatabaseUrl(dataSourceOptions),
                "isolation_level": "read-committed",
                "use_prepared_statements": false
            },
            "extensions_schema": "extensions_schema_test"
        }
    }
}
