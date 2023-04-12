import type * as Hasura from "hasura-metadata-types";
import * as TypeORM from "typeorm";
import { generateRelationships } from "./relationships";
import { generateTableConfiguration } from "./tableConfiguration";
import { DataSourceOptions } from "../types";
import { generatePermissions } from "./permissions";
import { internalStorage } from "../internalStorage";

export function generateTable<Entity extends Object>(
    dataSourceOptions: DataSourceOptions,
    table: TypeORM.EntityMetadata
): Hasura.MetadataTable {
    const entityWorkspace = internalStorage.getEntityWorkspace<Entity>(table.target);

    const metadata: Hasura.MetadataTable = {
        table: {
            name: table.tableName,
            // todo: does not work?
            // schema: table.schema,
            schema: 'schema' in table.connection.options && table.connection.options.schema || 'public',
        },
        configuration: generateTableConfiguration(table, entityWorkspace),
        ...generateRelationships(table.relations),
        ...generatePermissions(dataSourceOptions, entityWorkspace),
    }

    // be consistent with hasura
    if (!metadata.object_relationships?.length) delete metadata.object_relationships;
    if (!metadata.array_relationships?.length) delete metadata.array_relationships;
    if (!metadata.insert_permissions?.length) delete metadata.insert_permissions;
    if (!metadata.select_permissions?.length) delete metadata.select_permissions;
    if (!metadata.update_permissions?.length) delete metadata.update_permissions;
    if (!metadata.delete_permissions?.length) delete metadata.delete_permissions;

    return metadata;
}
