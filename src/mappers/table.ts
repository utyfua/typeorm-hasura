import * as TypeORM from "typeorm";
import * as Hasura from "../MetadataV3";

export function generateTable(table: TypeORM.EntityMetadata): Hasura.MetadataTable {
    console.log(table);
    return {
        table: {
            name: table.tableName,
            schema: table.schema,
        },
        object_relationships: [],
        array_relationships: [],
        insert_permissions: [],
        select_permissions: [],
        update_permissions: [],
        delete_permissions: [],
    }
}
