import { FindOptionsWhere, FindOperatorType, BaseEntity } from "typeorm";

export type Where<Entity> = FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>

type StringParameters =
    | "_eq"
    | "_neq"
    | "_gt"
    | "_lt"
    | "_gte"
    | "_lte"
    | "_like"
    | "_nlike"
    | "_ilike"
    | "_nilike"
// | "_similar"
// | "_nsimilar"
// | "_regex"
// | "_iregex"
// | "_nregex"
// | "_niregex"

type ArrayParameters =
    | "_in"
    | "_nin"
// | "_ceq"
// | "_cne"
// | "_cgt"
// | "_clt"
// | "_cgte"
// | "_clte"
type NullParameters = "_is_null"
type JsonBParameters =
    | "_contains"
// | "_contained_in"
// | "_has_key"
// | "_has_keys_any"
// | "_has_keys_all"
export type ExclusiveParameters =
    { [key in StringParameters]?: string | number | boolean; } &
    { [key in ArrayParameters]?: string[] } &
    { [key in NullParameters]?: boolean } &
    { [key in JsonBParameters]?: Object }

export type StripBaseEntity<Entity extends Object> = Omit<Entity, keyof BaseEntity>

export type Filter<Entity extends any> = {
    _and?: Filter<Entity>[];
    _or?: Filter<Entity>[];
    _not?: Filter<Entity>
} & {
    [key in keyof Entity]?: Filter<Entity[key] extends Array<infer U> ? U : Entity[key]> | ExclusiveParameters
}

export type FilterAlt = {
    [key: string]: ExclusiveParameters | FilterAlt;
}

export const Operators: Readonly<
    Partial<Record<FindOperatorType, StringParameters | ArrayParameters | NullParameters>>
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
    "isNull": "_is_null",
} as const

export const OppositeOperators: Readonly<
    Partial<Record<StringParameters | ArrayParameters, StringParameters | ArrayParameters>>
> = {
    "_eq": "_neq",
    "_neq": "_eq",
    //
    "_gt": "_lte",
    "_lt": "_gte",
    //
    "_gte": "_lt",
    "_lte": "_gt",
    //
    "_like": "_nlike",
    "_nlike": "_like",
    //
    "_ilike": "_nilike",
    "_nilike": "_ilike",
    //
    "_in": "_nin",
    "_nin": "_in"
}

// all typeorm operators FindOperatorType
