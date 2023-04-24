import { UserActionType, UserRoleName } from "./base";
import { EntityTarget } from "./Entity";


export interface ColumnOptions {
    /**
     * Column type which will be allowed to do actions.
     */
    permissions?: {
        [role: UserRoleName]: UserActionType[] | UserActionType | boolean
    }
}

export interface ColumnMetadata {
    object: EntityTarget,
    propertyName: string,
    options: ColumnOptions | undefined,
}