import { Where } from "./whereClause";

export interface BasePermissionRule<Entity extends Object> {
    where?: Where<Entity>;
}

export interface SelectPermissionRule<Entity extends Object> extends BasePermissionRule<Entity> {
    /**
     * limit the number of rows returned by the query(select action only)
     */
    limit?: number;
    /**
     * allow aggregations on the table (select action only)
     */
    allowAggregations?: boolean;
}
