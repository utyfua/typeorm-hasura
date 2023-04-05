import * as TypeORM from "typeorm";
import type * as Hasura from "hasura-metadata-types";

type RelationshipKind = 'object_relationships' | 'array_relationships'

export function generateRelationship(relation: TypeORM.EntityMetadata['relations'][number]): {
    kind: RelationshipKind,
    relationship: Hasura.LocalTableObjectRelationship | Hasura.SameTableObjectRelationship
} {
    const kind = relation.relationType.endsWith('-to-one') ? 'object_relationships' : 'array_relationships';

    const owningRelation = relation.isOwning ? relation : relation.inverseRelation;

    if (!owningRelation)
        throw new Error('Does not support many-to-many relations yet, so we will skip this specific relation. ' +
            'Also its possible that you have missed to set inverse side of the relation.');

    const columns = owningRelation.joinColumns.map(column => column.propertyName);

    // todo: does not work?
    // const schema = owningRelation.entityMetadata.schema;
    // @ts-ignore is that okay?
    const schema = owningRelation.target.dataSource.options.schema || 'public';

    const relationship: Hasura.LocalTableObjectRelationship | Hasura.SameTableObjectRelationship =
        relation.isOwning ? {
            name: relation.propertyName,
            using: {
                foreign_key_constraint_on: columns
            }
        } : {
            name: relation.propertyName,
            using: {
                foreign_key_constraint_on: {
                    columns,
                    table: {
                        name: owningRelation.entityMetadata.tableName,
                        schema,
                    }
                }
            }
        }

    return { kind, relationship };
}

export function generateRelationships(relations: TypeORM.EntityMetadata['relations']):
    Pick<Hasura.MetadataTable, RelationshipKind> {
    const result: Required<Pick<Hasura.MetadataTable, RelationshipKind>> = {
        object_relationships: [],
        array_relationships: [],
    }

    for (const relation of relations) {
        try {
            const { kind, relationship } = generateRelationship(relation);
            // @ts-ignore dont want to play with types for now
            result[kind].push(relationship);
        } catch (e) {
            console.warn(e);
        }
    }

    return result;
}
