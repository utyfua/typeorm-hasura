import { CustomDataSourceOptions } from "../types";
import * as Hasura from "../MetadataV3";
import { getHasuraKind } from "./hasuraKind";
import { getDatabaseUrl } from "./databaseUrl";
import { generateTable } from "./table";

export function generateSource(options: CustomDataSourceOptions): Hasura.Source {
    return {
        name: options.name,
        kind: getHasuraKind(options.dataSource.options.type),
        tables: [...options.dataSource.entityMetadatas].reverse().map(generateTable),
        customization: options.customization,
        configuration: {
            "connection_info": {
                "database_url": getDatabaseUrl(options),
                "isolation_level": "read-committed",
                "use_prepared_statements": false
            },
            "extensions_schema": "extensions_schema_test"
        }
    }
}
