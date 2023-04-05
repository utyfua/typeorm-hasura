import { DocumentNode } from "graphql"
import type * as Hasura from "hasura-metadata-types";
import { UserRoleName } from "./base";

export type GraphQlMetadataForAction = {
    baseActions: (Omit<Hasura.Action, 'definition'> & {
        definition: Pick<Hasura.ActionDefinition, 'type' | 'output_type' | 'arguments'>;
    })[],
    custom_types: Hasura.CustomTypes,
}

export type ActionCustomMetadataV1 = {
    comment?: string,
    /**
     * The action's webhook URL
     */
    handler: string,
    definitionType: DocumentNode,
    /**
     * If set to true the client headers are forwarded to the webhook handler (default: false)
     */
    forwardClientHeaders?: boolean
    nativeDefinition: Partial<Hasura.ActionDefinition>,
    permissions?: { role: UserRoleName }[];
}

export type ActionBuildResult = Required<Pick<Hasura.Metadata['metadata'], 'actions' | 'custom_types'>>
