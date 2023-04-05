import { DocumentNode, FieldDefinitionNode, InputValueDefinitionNode } from "graphql";
import type * as Hasura from "hasura-metadata-types";
import { GraphQlMetadataForAction } from "../types";

function mapFields(values: readonly InputValueDefinitionNode[] | readonly FieldDefinitionNode[]): Hasura.InputArgument[] {
    return values.map(value => ({
        name: value.name.value,
        // @ts-ignore
        type: value.type.kind === "NonNullType" ? value.type.type.name.value + "!" : value.type.name.value,
    }));
}

export function getGraphQLDefinitions(document: DocumentNode): GraphQlMetadataForAction {
    const result: GraphQlMetadataForAction = {
        baseActions: [],
        custom_types: {
            input_objects: [],
            objects: [],
        },
    };
    for (const definition of document.definitions) {
        // type Query or type Mutation
        if (definition.kind === "ObjectTypeDefinition" && ["Query", "Mutation"].includes(definition.name.value)) {
            if (!definition.fields)
                throw new Error(`No fields found in definition for ${definition.name.value}`);
            for (const field of definition.fields) {
                const type = definition.name.value.toLowerCase();
                if (type !== "query" as const && type !== "mutation" as const)
                    throw new Error(`Invalid type ${type} for field ${field.name.value}`);

                let output_type: string;
                if (field.type.kind === "NamedType") {
                    output_type = field.type.name.value;
                } else
                    throw new Error(`Invalid type ${field.type.kind} for field ${field.name.value}`);

                result.baseActions.push({
                    name: field.name.value,
                    definition: {
                        type,
                        output_type,
                        arguments: mapFields(field.arguments || []),
                    }
                })
            }
            continue
        }

        // InputObjectTypeDefinition or ObjectTypeDefinition
        else if (definition.kind === "InputObjectTypeDefinition" || definition.kind === "ObjectTypeDefinition") {
            const type = definition.kind === "InputObjectTypeDefinition" ? "input_objects" : "objects";
            result.custom_types[type]!.push({
                name: definition.name.value,
                fields: mapFields(definition.fields || []),
            })
        }

        else throw new Error(`Invalid definition ${definition.kind}`);
    }
    return result;
}
