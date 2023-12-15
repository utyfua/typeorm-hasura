import * as TypeORM from "typeorm";
import { Where, Filter } from "../types";
import { operatorMappers } from "./operators";

export function convertWhereClause<Entity extends Object>(
    table: TypeORM.EntityMetadata,
    ...wheres: (Where<Entity> | undefined)[]
): Filter<Entity> {
    wheres = wheres.filter(Boolean)
    if (!wheres.length) return {}
    if (wheres.length > 1) {
        return {
            _and: wheres.map(where => convertWhereClause(table, where))
        }
    }
    const [where] = wheres

    if (!where) return {}
    if (Array.isArray(where)) {
        return { _or: where.map(i => parseParameters(table, i)) }
    }
    return parseParameters(table, where)
}

function parseParameters<Entity extends Object>(
    table: TypeORM.EntityMetadata,
    object: TypeORM.FindOptionsWhere<Entity>
): Filter<Entity> {
    let conditions: Filter<Entity>[] = []
    for (let key in object) {
        const parameterValue = object[key]
        const column = table.columns.find(i => i.databaseName === key)
        const relation = table.relations.find(i => i.propertyName === key)

        const isJsonb = column?.type === "jsonb" && typeof parameterValue == "object"

        if (TypeORM.InstanceChecker.isFindOperator(parameterValue) && !isJsonb) {
            conditions.push({ [key]: operatorMappers(parameterValue) })
        } else if (["string", "number", "boolean"].includes(typeof parameterValue)) {
            conditions.push({ [key]: { "_eq": parameterValue } })
        } else if (relation && parameterValue) {
            conditions.push({ [key]: parseParameters(relation.inverseEntityMetadata, parameterValue) })
        } else if (TypeORM.InstanceChecker.isFindOperator(parameterValue) && parameterValue.type == "not" && isJsonb) {
            conditions.push({ _not: { [key]: { "_contains": parameterValue.value } } })
        } else if (isJsonb) {
            conditions.push({ [key]: { "_contains": parameterValue } })
        } else {
            throw new Error(`this parameter is not supported in this time`);
        }
    }
    return conditions.length == 0 ? {} :
        conditions.length == 1 ? conditions[0] :
            { _and: conditions }
}
