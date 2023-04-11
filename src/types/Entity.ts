import { UserActionType, UserRoleName } from "./base";
import { BasePermissionRule, SelectPermissionRule } from "./permissions";
import { Where } from "./whereClause";

export type EntityTarget = any;

export interface EntityRootField {
    /**
     * name for root field
     */
    name?: string;
    /**
     * user visible comment for root field
     */
    comment?: string;
}

export type Permissions<Entity extends Object> = {
    [role: UserRoleName]: {
        /**
         * append where clause to all actions
         */
        where?: Where<Entity>;
        select?: SelectPermissionRule<Entity> | boolean;
    } & {
        [action in Exclude<UserActionType, 'select'>]?: BasePermissionRule<Entity> | boolean;
    }
}

export interface EntityOptions<Entity extends Object = Object> {
    /**
     * Table name which will be show up in hasura.
     */
    customName?: string;

    customRootFields?: 
        Partial<Record<
            | 'select'
            | 'selectByPk'
            | 'selectAggregate'
            | 'selectStream'
            | 'insert'
            | 'insertOne'
            | 'update'
            | 'updateByPk'
            | 'delete'
            | 'deleteByPk'
            | 'updateMany'
        , EntityRootField | string>>,

    permissions?: Permissions<Entity>
}
