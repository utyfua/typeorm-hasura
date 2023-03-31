import { FindOptionsWhere, InstanceChecker } from "typeorm";
import { Where, Filter, Operators, } from "../types";

export function convertWhereClause<Entity extends Object>(input: Where<Entity>): Filter<keyof Entity> {
    if (Array.isArray(input)) {
        return { _or: input.map(i => parseParameters(i)) }
    }
    return parseParameters(input)
}

function parseParameters<Entity extends Object>(object: FindOptionsWhere<Entity>): Filter<keyof Entity> {
    let conditions: Filter<keyof Entity>[] = []
    for (let key in object) {
        const parameterValue = object[key]
        if (InstanceChecker.isFindOperator(parameterValue)) {
            const operator = Operators[parameterValue.type]
            if (operator) {
                conditions.push({ [key]: { [operator]: parameterValue.value } })
            } else
                throw new Error("this operator is not supported in this time");
        } else if (["string", "number", "boolean"].includes(typeof parameterValue)) {
            conditions.push({ [key]: { "_eq": parameterValue } })
        } else
            throw new Error("this parameter is not supported in this time");
    }
    return conditions.length == 0 ? {} :
        conditions.length == 1 ? conditions[0] :
            { _and: conditions }
}
