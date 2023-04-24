import { FindOperator } from "typeorm"
import { ExclusiveParameters, Operators } from "../types"

export function operatorMappers(operator: FindOperator<any>): ExclusiveParameters {
    const { type } = operator
    if (!(type in Operators))
        throw new Error(`${operator.type} operator is not supported in this time`);
    const subOperator = operator?.child

    if (subOperator?.child)
        throw new Error(`${subOperator.child?.type} operator is not supported in this time`);

    switch (type) {
        case "not":
            if (subOperator?.type === "isNull")
                return { _is_null: false }
            return { [Operators["not"]!]: operator.value }
        case "isNull":
            return { _is_null: true }
        default:
            return { [Operators[type]!]: operator.value }
    }
}
