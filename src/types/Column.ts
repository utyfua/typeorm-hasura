import { UserActionType, UserRoleName } from "./base";
import { EntityTarget } from "./Entity";


export interface ColumnOptions {
    /**
     * Column name which will be show up in hasura.
     * 
     * @deprecated please DO NOT use this property cuz its unsafe and unstable.
     */
    customName?: string;

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