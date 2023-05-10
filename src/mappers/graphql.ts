import { DocumentNode, FieldDefinitionNode, InputValueDefinitionNode, TypeNode } from "graphql";
import type * as Hasura from "hasura-metadata-types";
import { GraphQlMetadataForAction } from "../types";

function mapType(type: TypeNode): string {
    if (type.kind === "NamedType") {
        return type.name.value;
    } else if (type.kind === "NonNullType") {
        return mapType(type.type) + "!";
    } else if (type.kind === "ListType") {
        return "[" + mapType(type.type) + "]";
    } else {
        // @ts-ignore never?
        throw new Error(`Invalid type ${type.kind}`);
    }
}

function mapField(value: InputValueDefinitionNode | FieldDefinitionNode): Hasura.InputArgument {
    return {
        name: value.name.value,
        type: mapType(value.type),
    }
}

export function getGraphQLDefinitions(document: DocumentNode): GraphQlMetadataForAction {
    const result: GraphQlMetadataForAction = {
        baseActions: [],
        custom_types: {
            input_objects: [],
            objects: [],
            scalars: [],
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

                result.baseActions.push({
                    name: field.name.value,
                    definition: {
                        type,
                        output_type: mapType(field.type),
                        arguments: field.arguments?.map(mapField) || [],
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
                fields: definition.fields?.map(mapField) || [],
            })
        }

        // ScalarTypeDefinition
        else if (definition.kind === "ScalarTypeDefinition") {
            result.custom_types.scalars!.push({
                name: definition.name.value,
            })
        }

        else throw new Error(`Invalid definition ${definition.kind}`);
    }
    return result;
}
