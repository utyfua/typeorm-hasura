import { UserActionType, UserRole } from "./base";
import { EntityTarget } from "./Entity";


export interface ColumnOptions {
    /**
     * Column name which will be show up in hasura.
     */
    customName?: string;

    /**
     * Column type which will be allowed to do actions.
     */
    permissions?: {
        [role: UserRole]: UserActionType[] | UserActionType | boolean
    }
}

export interface ColumnMetadata {
    object: EntityTarget,
    propertyName: string,
    options: ColumnOptions | undefined,
}