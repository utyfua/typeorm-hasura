import type * as Hasura from "hasura-metadata-types";
import { DataSourceOptions } from "../types";
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
            // sort to be consistent with hasura
            .sort((a, b) => a.name.localeCompare(b.name))
            // we only want to generate tables for regular tables cuz we doesn't support another types
            .filter(table => table.tableType === 'regular' || table.tableType === "view")
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
