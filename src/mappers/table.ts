import * as TypeORM from "typeorm";
import * as Hasura from "../MetadataV3";
import { generateRelationships } from "./relationships";
import { generateTableConfiguration } from "./tableConfiguration";
import { DataSourceOptions } from "../types";
import { generatePermissions } from "./permissions";
import { internalStorage } from "../internalStorage";

export function generateTable<Entity extends Object>(
    dataSourceOptions: DataSourceOptions,
    table: TypeORM.EntityMetadata
): Hasura.MetadataTable {
    const entityOptions = internalStorage.getEntityOptions<Entity>(table.target);
    const columnMetadata = internalStorage.getEntityColumnsOptionsList(table.target);

    return {
        table: {
            name: table.tableName,
            // todo: does not work?
            // schema: table.schema,
            schema: 'schema' in table.connection.options && table.connection.options.schema || 'public',
        },
        configuration: generateTableConfiguration(table, entityOptions, columnMetadata),
        ...generateRelationships(table.relations),
        ...generatePermissions(dataSourceOptions, entityOptions, columnMetadata),
    }
}
