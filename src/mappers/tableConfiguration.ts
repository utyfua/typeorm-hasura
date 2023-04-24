import * as TypeORM from "typeorm";
import type * as Hasura from "hasura-metadata-types";
import { EntityInternalStorageWorkspace, EntityRootField } from "../types";
import snakeCase from 'lodash.snakecase'

export function generateTableConfiguration<Entity extends Object>(
    table: TypeORM.EntityMetadata,
    { entityOptions, columnMetadata }: EntityInternalStorageWorkspace<Entity>,
): Hasura.MetadataTableConfig {

    let custom_name: string | undefined = entityOptions && entityOptions.customName || table.tableName;

    const columnHasuraEntries: [string, Hasura.MetadataTableColumnConfig][] = [];

    const column_config = columnHasuraEntries.length ? Object.fromEntries(columnHasuraEntries) : {};

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
        column_config,

        // legacy, but we are consistent with hasura
        custom_column_names: {},

        custom_name,
        custom_root_fields,
    }
}
