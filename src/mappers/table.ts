import * as TypeORM from "typeorm";
import * as Hasura from "../MetadataV3";
import { generateRelationships } from "./relationships";
import { generateTableConfiguration } from "./tableConfiguration";
import { DataSourceOptions } from "../types";
import { generatePermissions } from "./permissions";

export function generateTable(
    dataSourceOptions: DataSourceOptions,
    table: TypeORM.EntityMetadata
): Hasura.MetadataTable {
    return {
        table: {
            name: table.tableName,
            // todo: does not work?
            // schema: table.schema,
            schema: 'schema' in table.connection.options && table.connection.options.schema || 'public',
        },
        configuration: generateTableConfiguration(table),
        ...generateRelationships(table.relations),
        ...generatePermissions(table)
    }
}
