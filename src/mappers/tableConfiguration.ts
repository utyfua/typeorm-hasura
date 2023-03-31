import * as TypeORM from "typeorm";
import * as Hasura from "../MetadataV3";
import { internalStorage } from "../internalStorage";

export function generateTableConfiguration(table: TypeORM.EntityMetadata): Hasura.MetadataTableConfig {
    const tableConfig = internalStorage.getEntityOptions(table.target);
    const columnConfigList = internalStorage.getEntityColumnsOptionsList(table.target);

    let custom_name: string | undefined = tableConfig && tableConfig.customName || table.tableName;
    if (custom_name === table.tableName) custom_name = undefined;

    const columnHasuraEntries: [string, Hasura.MetadataTableColumnConfig][] = [];
    for (const column of columnConfigList) {
        // looks like its only possible to set custom_name for columns here
        if (column.options?.customName) {
            columnHasuraEntries.push([column.propertyName, {
                custom_name: column.options.customName,
            }])
        }
    }
    const column_config = columnHasuraEntries.length ? Object.fromEntries(columnHasuraEntries) : undefined;

    return {
        custom_name,
        column_config,
    }
}
