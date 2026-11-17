import type { FindOperator, FindOperatorType } from "typeorm"
import type { ArrayOperators, FilterBaseParameters, NullOperator, StringOperators } from "../types"

const OperatorsMap = {
    // string
    "equal": "_eq",
    "not": "_neq",
    "moreThan": "_gt",
    "lessThan": "_lt",
    "moreThanOrEqual": "_gte",
    "lessThanOrEqual": "_lte",
    "like": "_like",
    "ilike": "_ilike",
    // array
    "in": "_in",
    "arrayContains": "_contains",
    "isNull": "_is_null",
} satisfies Readonly<
    Partial<Record<FindOperatorType, StringOperators | ArrayOperators | NullOperator | "_contains">>
>

function isMappedOperator(type: string): type is keyof typeof OperatorsMap {
    return type in OperatorsMap
}

export function mapOperator(operator: FindOperator<any>): FilterBaseParameters {
    const { type } = operator
    if (!isMappedOperator(type))
        throw new Error(`${operator.type} operator is not supported in this time`);
    const subOperator = operator?.child

    if (subOperator?.child)
        throw new Error(`${subOperator.child?.type} operator is not supported in this time`);

    switch (type) {
        case "not":
            if (subOperator?.type === "isNull")
                return { _is_null: false }
            return { _neq: operator.value }
        case "isNull":
            return { _is_null: true }
        default:
            return { [OperatorsMap[type]]: operator.value }
    }
}
