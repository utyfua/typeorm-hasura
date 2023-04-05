import * as TypeORM from "typeorm";
import type * as Hasura from "hasura-metadata-types";
import { ColumnMetadata, EntityOptions, EntityRootField } from "../types";
import snakeCase from 'lodash.snakecase'

export function generateTableConfiguration<Entity extends Object>(table: TypeORM.EntityMetadata,
    entityOptions: EntityOptions<Entity> | undefined,
    columnMetadata: ColumnMetadata[]
): Hasura.MetadataTableConfig {

    let custom_name: string | undefined = entityOptions && entityOptions.customName || table.tableName;

    const columnHasuraEntries: [string, Hasura.MetadataTableColumnConfig][] = [];
    for (const column of columnMetadata) {
        // looks like its only possible to set custom_name for columns here
        if (column.options?.customName) {
            columnHasuraEntries.push([column.propertyName, {
                custom_name: column.options.customName,
            }])
        }
    }
    const column_config = columnHasuraEntries.length ? Object.fromEntries(columnHasuraEntries) : undefined;

    const custom_root_fields: Record<string, EntityRootField> = {};
    if (entityOptions?.customRootFields) {
        // iterate over all possible root fields and push them to custom_root_fields
        for (const rootField in entityOptions.customRootFields) {
            let rootFieldConfig = entityOptions.customRootFields[rootField as keyof typeof entityOptions.customRootFields];
            if (rootFieldConfig) {
                if (typeof rootFieldConfig === 'string') {
                    rootFieldConfig = {
                        name: rootFieldConfig,
                    };
                }
                custom_root_fields[snakeCase(rootField)] = rootFieldConfig;
            }
        }
    }

    return {
        custom_name,
        column_config,
        custom_root_fields,
    }
}
