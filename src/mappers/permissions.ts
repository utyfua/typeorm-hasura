import { MetadataTable } from "../MetadataV3";
import { ColumnMetadata, DataSourceOptions, EntityOptions, UserActionType } from "../types";
import { convertWhereClause } from "./whereClause"
export type PermissionResult = Required<Pick<
    MetadataTable,
    "insert_permissions" | "select_permissions" | "update_permissions" | "delete_permissions"
>>

export function generatePermissions<Entity extends Object = Object>(
    dataSourceOptions: DataSourceOptions,
    entityOptions: EntityOptions<Entity> | undefined,
    columnMetadata: ColumnMetadata[]
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
            result.select_permissions.push({
                role: key,
                permission: {
                    columns: columnNames(columnMetadata, key, "select"),
                    filter: convertWhereClause<Entity>(where, select.where),
                    limit: select.limit || dataSourceOptions.defaultSelectPermissionLimit,
                }
            })
        }
        if (update) {
            if (update === true) update = {}
            result.update_permissions.push({
                role: key,
                permission: {
                    columns: columnNames(columnMetadata, key, "update"),
                    filter: convertWhereClause<Entity>(where, update.where)
                }
            })
        }

        if (insert) {
            if (insert === true) insert = {}
            if (insert.where) throw new Error("u can not select while inserting something")
            result.insert_permissions.push({
                role: key,
                permission: {
                    columns: columnNames(columnMetadata, key, "insert"),
                }
            })
        }

        if (myDelete) {
            if (myDelete === true) myDelete = {}
            result.delete_permissions.push({
                role: key,
                permission: {
                    filter: convertWhereClause<Entity>(where, myDelete.where)
                }
            })
        }
    }
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
