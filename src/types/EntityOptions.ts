import { UserActionType, UserRole } from "./base";
import { BasePermissionRule, SelectPermissionRule } from "./permissions";
import { Where } from "./whereClause";

export interface EntityOptions<Entity extends Object> {
    /**
     * Table name which will be show up in hasura.
     */
    customName?: string;

    permissions?: {
        [role: UserRole]: {
            /**
             * append where clause to all actions
             */
            where?: Where<Entity>;
            select?: SelectPermissionRule<Entity> | boolean;
        } & {
            [action in Exclude<UserActionType, 'select'>]?: BasePermissionRule<Entity> | boolean;
        }
    }
}
