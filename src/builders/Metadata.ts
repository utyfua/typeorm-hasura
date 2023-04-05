import { ActionBuildResult, DataSourceOptions, GraphQlMetadataForAction } from "../types";
import * as Hasura from "../MetadataV3";
import { generateSource } from "../mappers";

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
                // inherited_roles?: InheritedRole[];
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
     */
    addSource(sourceOptions: DataSourceOptions) {
        const source = generateSource(sourceOptions);
        this._metadata.metadata.sources.push(source)
        return this;
    }

    /**
     * Adds multiple sources to the metadata.
     */
    addSources(sourceOptions: DataSourceOptions[]) {
        sourceOptions.forEach(sourceOptions => this.addSource(sourceOptions));
        return this;
    }


    // .addActions([
    //     currencyConverterAction
    // ])

    /**
     * Adds an action to the metadata.
     */
    addAction(action: ActionBuildResult) {
        const metadata = this._metadata.metadata;
        if(!metadata.actions || !metadata.custom_types?.input_objects) {
            throw new Error("Metadata object is not initialized correctly.");
        }
        metadata.actions.push(...action.actions);
        metadata.custom_types.input_objects?.push(...action.custom_types?.input_objects!);
        metadata.custom_types.objects?.push(...action.custom_types?.objects!);
        return this;
    }

    /**
     * Adds multiple actions to the metadata.
     */
    addActions(actions: ActionBuildResult[]) {
        actions.forEach(action => this.addAction(action));
        return this;
    }


    /**
     * Returns the metadata.
     * 
     * @note This method is not async because we might need to do some async stuff in the future.
     */
    getMetadata(): Hasura.Metadata | Promise<Hasura.Metadata> {
        return this._metadata;
    }
}
