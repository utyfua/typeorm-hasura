import axios from "axios";
import type * as Hasura from "hasura-metadata-types";
import { ActionBuildResult, DataSourceOptions, InheritedRoles } from "../types";
import { generateSource } from "../mappers";
import { convertInheritedRoles } from "../mappers/inheritedRoles";

/**
 * The builder for the metadata.
 */
export class MetadataBuilder {
    private _metadata: Hasura.Metadata;

    constructor() {
        this._metadata = {
            resource_version: 0,
            metadata: {
                version: 3,
                sources: [],
                actions: [],
                custom_types: {
                    input_objects: [],
                    objects: [],
                    scalars: [],
                    enums: [],
                },
                // backend_configs?: BackendConfigs;
                // remote_schemas?: RemoteSchema[];
                // query_collections?: QueryCollection[];
                // allowlist?: AllowList[];
                inherited_roles: [],
                // cron_triggers?: CronTrigger[];
                // network?: Network;
                // rest_endpoints?: RestEndpoint[];
                // api_limits?: ApiLimits;
                // graphql_schema_introspection?: GraphQLSchemaIntrospection;

                /**
                 * The EE Lite OpenTelemetry settings.
                 *
                 * ATTENTION: Both Lux and the EE Lite server allow configuring OpenTelemetry. Anyway, this only
                 * represents the EE Lite one since Lux stores the OpenTelemetry settings by itself.
                 */
                // opentelemetry?: OpenTelemetry;
            }
        }
    }

    /**
     * Adds a source to the metadata.
     * 
     * @param sourceOptions The options of the source to add.
     */
    addSource(sourceOptions: DataSourceOptions) {
        const source = generateSource(sourceOptions);
        this._metadata.metadata.sources.push(source)
        return this;
    }

    /**
     * Adds multiple sources to the metadata.
     * 
     * @param sourceOptionsList The options of the sources to add.
     */
    addSources(sourceOptionsList: DataSourceOptions[]) {
        sourceOptionsList.forEach(sourceOptions => this.addSource(sourceOptions));
        return this;
    }

    /**
     * Adds an action to the metadata.
     * 
     * @param action The action to add.
     * @note Use the `ActionBuilder` to create an action.
     */
    addAction(action: ActionBuildResult) {
        const metadata = this._metadata.metadata;
        if (!metadata.actions || !metadata.custom_types?.input_objects) {
            throw new Error("Metadata object is not initialized correctly.");
        }
        metadata.actions.push(...action.actions);
        metadata.custom_types.input_objects?.push(...action.custom_types?.input_objects!);
        metadata.custom_types.objects?.push(...action.custom_types?.objects!);
        return this;
    }

    /**
     * Adds multiple actions to the metadata.
     * 
     * @param actions The actions to add.
     * @note Use the `ActionBuilder` to create an action.
     */
    addActions(actions: ActionBuildResult[]) {
        actions.forEach(action => this.addAction(action));
        return this;
    }

    /**
    * Adds inherited roles to the metadata.
    * 
    * @param roles The map of roles to inherit.
    */
    addInheritedRoles(roles: InheritedRoles) {
        this._metadata.metadata.inherited_roles!.push(...convertInheritedRoles(roles))
        return this
    }

    /**
     * Returns the metadata.
     * 
     * @note This method is not async because we might need to do some async stuff in the future.
     */
    getMetadata(): Hasura.Metadata | Promise<Hasura.Metadata> {
        return this._metadata;
    }

    /**
     * Applies the metadata to the Hasura instance.
     * 
     * @param hasuraUrl The URL of the Hasura instance.
     * @param adminSecret The admin secret of the Hasura instance.
     * @returns The response of the Hasura instance.
    */
    async applyMetadata({ hasuraUrl, adminSecret }: { hasuraUrl: string, adminSecret: string }) {
        const { metadata } = await this.getMetadata();
        const { data } = await axios.post(`${hasuraUrl}/v1/metadata`, {
            type: "replace_metadata",
            args: metadata
        }, {
            headers: {
                'X-Hasura-Admin-Secret': adminSecret
            }
        })
        return data;
    }
}
