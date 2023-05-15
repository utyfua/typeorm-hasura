import { Where } from "./whereClause";

export interface BasePermissionRule<Entity extends Object> {
    where?: Where<Entity>;
}

export interface InsertPermissionRule<Entity extends Object> {
    check?: Where<Entity>;
}

export interface SelectPermissionRule<Entity extends Object> {
    where?: Where<Entity>;
    /**
     * limit the number of rows returned by the query(select action only)
     */
    limit?: number;
    /**
     * allow aggregations on the table (select action only)
     */
    allowAggregations?: boolean;
}

export interface UpdatePermissionRule<Entity extends Object> {
    /**
     * Pre-update check condition
     */
    where?: Where<Entity>;
    /**
     * Post-update check condition
     */
    check?: Where<Entity>;
    /**
     * Column presets
     * 
     * if its a plain property it will be set to the value, but in another case you cannot use the value of the property
     */
    set?: Partial<Record<keyof Entity, unknown>>;
}
