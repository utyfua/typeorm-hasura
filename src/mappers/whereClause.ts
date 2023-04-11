import { FindOptionsWhere, InstanceChecker, And } from "typeorm";
import { Where, Filter, Operators, } from "../types";

export function convertWhereClause<Entity extends Object>(...wheres: (Where<Entity> | undefined)[]): Filter<Entity> {
    wheres = wheres.filter(Boolean)
    if (!wheres.length) return {}
    if (wheres.length > 1) {
        return {
            _and: wheres.map(where => convertWhereClause(where))
        }
    }
    const [where] = wheres

    if (!where) return {}
    if (Array.isArray(where)) {
        return { _or: where.map(i => parseParameters(i)) }
    }
    return parseParameters(where)
}

function parseParameters<Entity extends Object>(object: FindOptionsWhere<Entity>): Filter<Entity> {
    let conditions: Filter<Entity>[] = []
    for (let key in object) {
        const parameterValue = object[key]
        if (InstanceChecker.isFindOperator(parameterValue)) {
            const operator = Operators[parameterValue.type]
            if (operator) {
                conditions.push({ [key]: { [operator]: parameterValue.value } })
            } else
                throw new Error(`operator "${parameterValue.type}" is not supported in this time`);
        } else if (["string", "number", "boolean"].includes(typeof parameterValue)) {
            conditions.push({ [key]: { "_eq": parameterValue } })
        } else if (typeof parameterValue === "object" && !Array.isArray(parameterValue) && parameterValue !== null) {
            conditions.push({ [key]: parseParameters(parameterValue) })
        } else
            throw new Error("this parameter is not supported in this time");
    }
    return conditions.length == 0 ? {} :
        conditions.length == 1 ? conditions[0] :
            { _and: conditions }
}
