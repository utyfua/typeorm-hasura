import * as TypeORM from "typeorm";
import * as Hasura from "../MetadataV3";
import { generateRelationships } from "./relationships";

export function generateTable(table: TypeORM.EntityMetadata): Hasura.MetadataTable {
    return {
        table: {
            name: table.tableName,
            // todo: does not work?
            // schema: table.schema,
            schema: 'schema' in table.connection.options && table.connection.options.schema || 'public',
        },
        ...generateRelationships(table.relations),
        insert_permissions: [],
        select_permissions: [],
        update_permissions: [],
        delete_permissions: [],
    }
}
