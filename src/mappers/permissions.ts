import * as TypeORM from "typeorm";
import type * as Hasura from "hasura-metadata-types";
import { ColumnMetadata, DataSourceOptions, EntityInternalStorageWorkspace, UserActionType } from "../types";
import { convertWhereClause } from "./whereClause"
export type PermissionResult = Required<Pick<
    Hasura.MetadataTable,
    "insert_permissions" | "select_permissions" | "update_permissions" | "delete_permissions"
>>

export function generatePermissions<Entity extends Object = Object>(
    dataSourceOptions: DataSourceOptions,
    table: TypeORM.EntityMetadata,
    { entityOptions, columnMetadata }: EntityInternalStorageWorkspace<Entity>,
): PermissionResult {

    const result: PermissionResult = {
        insert_permissions: [],
        select_permissions: [],
        update_permissions: [],
        delete_permissions: [],
    }
    if (!entityOptions?.permissions)
        return result;

    const { permissions } = entityOptions

    for (let key in permissions) {
        const permission = permissions[key]
        let { where, select, update, insert, delete: myDelete } = permission

        if (select) {
            if (select === true) select = {}
            const limit = select.limit || dataSourceOptions.defaultSelectPermissionLimit
            result.select_permissions.push({
                role: key,
                permission: {
                    columns: columnNames(columnMetadata, key, "select"),
                    filter: convertWhereClause<Entity>(table, where, select.where),
                    limit,
                    allow_aggregations: select.allowAggregations,
                }
            })
        }
        if (update) {
            if (update === true) update = {}
            result.update_permissions.push({
                role: key,
                permission: {
                    columns: columnNames(columnMetadata, key, "update"),
                    filter: convertWhereClause<Entity>(table, where, update.where),
                    check: convertWhereClause<Entity>(table, update.check),
                    set: update.set
                }
            })
        }

        if (insert) {
            if (insert === true) insert = {}
            result.insert_permissions.push({
                role: key,
                permission: {
                    columns: columnNames(columnMetadata, key, "insert"),
                    check: convertWhereClause<Entity>(table, insert.check),
                    set: insert.set
                }
            })
        }

        if (myDelete) {
            if (myDelete === true) myDelete = {}
            result.delete_permissions.push({
                role: key,
                permission: {
                    filter: convertWhereClause<Entity>(table, where, myDelete.where)
                }
            })
        }
    }

    //  sort to make sure the order is consistent
    (["insert_permissions", "select_permissions", "update_permissions", "delete_permissions"] as const).forEach(key => {
        result[key].sort((a, b) => a.role.localeCompare(b.role))
    })

    return result
}

function columnNames(arr: ColumnMetadata[], roleName: string, method: UserActionType): string[] {
    return arr.filter(column => {
        let permission = column.options?.permissions?.[roleName]
        if (typeof permission == "boolean" || permission == undefined) return false;
        if (typeof permission == "string")
            permission = [permission]
        return permission.includes(method)
    }).map(i => i.propertyName)
}
