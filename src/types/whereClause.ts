import { FindOptionsWhere, FindOperatorType, BaseEntity } from "typeorm";

export type Where<Entity> = FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>

export type ExclusiveKeys<T extends {}, Key = { [K in keyof T]: { [P in keyof T]?: P extends K ? T[P] : never } }> =
    { [K in keyof Key]: Key[K] }[keyof Key];

type StringParameters =
    | "_eq"
    | "_neq"
    | "_gt"
    | "_lt"
    | "_gte"
    | "_lte"
    | "_like"
    // | "_nlike"
    | "_ilike"
// | "_nilike"
// | "_similar"
// | "_nsimilar"
// | "_regex"
// | "_iregex"
// | "_nregex"
// | "_niregex"

type ArrayParameters =
    | "_in"
// | "_nin"
// | "_ceq"
// | "_cne"
// | "_cgt"
// | "_clt"
// | "_cgte"
// | "_clte"
type NullParameters = "_is_null"
type JsonBParameters = "_contains" | "_contained_in" | "_has_key" | "_has_keys_any" | "_has_keys_all"

type ExclusiveParameters = ExclusiveKeys<
    { [key in StringParameters]?: string; } &
    { [key in ArrayParameters]?: string[] } &
    { [key in NullParameters]?: boolean }
>
type Subject<Entity extends Object> = {
    [key in keyof Entity]?: ExclusiveParameters
}
export type ExclusiveArguments<Entity extends Object, T = {}, EntityParameters extends string | number | symbol = keyof Omit<Entity, keyof BaseEntity>> =
    ExclusiveKeys<{ [key in EntityParameters]?: ExclusiveParameters | Subject<Entity> } & T>

export type Filter<EntityParameters extends Object> = ExclusiveKeys<{
    _and?: Filter<EntityParameters>[];
    _or?: Filter<EntityParameters>[];
    _not?: Filter<EntityParameters>
}> | ExclusiveArguments<EntityParameters>

export const Operators: Readonly<
    Partial<Record<FindOperatorType, StringParameters | ArrayParameters>>
> = {
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
}
enum NullParams {
    "isNull" = "_is_null"
}

// all typeorm operators FindOperatorType

