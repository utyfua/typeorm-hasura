import type { FindOptionsWhere, BaseEntity } from "typeorm";

export type Where<Entity> = FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>

export type StringOperators =
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

export type ArrayOperators =
    | "_in"
    | "_nin"
// | "_ceq"
// | "_cne"
// | "_cgt"
// | "_clt"
// | "_cgte"
// | "_clte"
export type NullOperator = "_is_null"
export type FilterBaseParameters =
    { [key in StringOperators]?: string | number | boolean; } &
    { [key in ArrayOperators]?: string[] } &
    { [key in NullOperator]?: boolean } &
    { _contains?: any[] | Object | string | number | boolean | null | undefined }

export type StripBaseEntity<Entity extends Object> = Omit<Entity, keyof BaseEntity>

export type Filter<Entity extends any> = {
    _and?: Filter<Entity>[];
    _or?: Filter<Entity>[];
    _not?: Filter<Entity>
} & {
    [key in keyof Entity]?: Filter<Entity[key] extends Array<infer U> ? U : Entity[key]> | FilterBaseParameters
}

export type FilterAlt = {
    [key: string]: FilterBaseParameters | FilterAlt;
}
