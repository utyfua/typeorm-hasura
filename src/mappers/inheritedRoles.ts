import type * as Hasura from "hasura-metadata-types";
import { InheritedRoles } from "../types";

export function convertInheritedRoles(roles: InheritedRoles): Hasura.InheritedRole[] {
    const result: Hasura.InheritedRole[] = []
    for (let key in roles) {
        result.push({
            role_name: key,
            role_set: roles[key]
        })
    }
    return result
}