import * as TypeORM from "typeorm";
import { Where, Filter, FilterAlt, ExclusiveParameters } from "../types";
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
    return parseParameters(table, where)
}

function parseParameters<Entity extends Object>(
    table: TypeORM.EntityMetadata,
    where: TypeORM.FindOptionsWhere<Entity> | TypeORM.FindOptionsWhere<Entity>[]
): Filter<Entity> {
    if (Array.isArray(where)) {
        return { _or: where.map(i => parseParameters(table, i)) }
    }

    let conditions: (FilterAlt | ExclusiveParameters)[] = []
    for (let key in where) {
        const parameterValue = where[key]
        const column = table.columns.find(i => i.databaseName === key)
        const relation = table.relations.find(i => i.propertyName === key)

        const isJsonb = column?.type === "jsonb" && typeof parameterValue == "object"

        if (TypeORM.InstanceChecker.isFindOperator(parameterValue) && !isJsonb) {
            conditions.push({ [key]: operatorMappers(parameterValue) })
        } else if (
            typeof parameterValue === "string" ||
            typeof parameterValue === "number" ||
            typeof parameterValue === "boolean"
        ) {
            conditions.push({ [key]: { "_eq": parameterValue } })
        } else if (relation && parameterValue) {
            // this is a relation so we can parse it recursively
            conditions.push({ [key]: parseParameters(relation.inverseEntityMetadata, parameterValue as TypeORM.FindOptionsWhere<Entity>) })
        } else if (TypeORM.InstanceChecker.isFindOperator(parameterValue) && parameterValue.type == "not" && isJsonb) {
            conditions.push({ _not: { [key]: { "_contains": parameterValue.value } } })
        } else if (isJsonb) {
            conditions.push({ [key]: { "_contains": parameterValue } })
        } else {
            throw new Error(`this parameter is not supported in this time`);
        }
    }
    return conditions.length == 0 ? {} :
        conditions.length == 1 ? conditions[0] as Filter<Entity> :
            { _and: conditions } as Filter<Entity>
}
