import type * as Hasura from "hasura-metadata-types";
import { getGraphQLDefinitions } from "../mappers/graphql";
import { ActionBuildResult, ActionCustomMetadataV1 } from "../types";

export class ActionBuilder {
    static buildV1(customMetadata: ActionCustomMetadataV1): ActionBuildResult {
        const defs = getGraphQLDefinitions(customMetadata.definitionType);
        if (defs.baseActions.length !== 1)
            throw new Error(`Expected exactly one base action, got ${defs.baseActions.length}`);
        const [baseAction] = defs.baseActions;
        const action: Hasura.Action = {
            name: baseAction.name,
            comment: customMetadata.comment,
            permissions: customMetadata.permissions,
            definition: {
                ...baseAction.definition,
                forward_client_headers: customMetadata.forwardClientHeaders || false,
                handler: customMetadata.handler,
                ...customMetadata.nativeDefinition,
            }
        };
        return {
            actions: [action],
            custom_types: defs.custom_types,
        };
    }
}
