import * as TypeORM from "typeorm";
import type * as Hasura from "hasura-metadata-types";

type RelationshipKind = 'object_relationships' | 'array_relationships'
type Relationship =
    | Hasura.LocalTableObjectRelationship
    | Hasura.SameTableObjectRelationship
    | Hasura.ManualObjectRelationship

export function generateRelationship(relation: TypeORM.EntityMetadata['relations'][number]): {
    kind: RelationshipKind,
    relationship: Relationship
} {
    const kind = relation.relationType.endsWith('-to-one') ?
        'object_relationships' : 'array_relationships';

    const owningRelation = relation.isOwning ?
        relation : relation.inverseRelation;

    if (!owningRelation || relation.isManyToMany)
        throw new Error('Does not support many-to-many relations yet, so we will skip this specific relation. ' +
            'Also its possible that you have missed to set inverse side of the relation.');

    const columns = owningRelation.joinColumns.map(column => column.databaseName);

    // todo: does not work?
    // const schema = owningRelation.entityMetadata.schema;
    // @ts-ignore is that okay?
    const schema = owningRelation.target.dataSource.options.schema || 'public';
    const tableType = owningRelation.entityMetadata.tableType

    let relationship: Relationship

    if (tableType === "regular" && relation.isOwning)
        relationship = {
            name: relation.propertyName,
            using: {
                foreign_key_constraint_on: columns.length === 1 ? columns[0] : columns
            }
        }
    else if (tableType === "regular" && !relation.isOwning)
        relationship = {
            name: relation.propertyName,
            using: {
                foreign_key_constraint_on: {
                    ...(columns?.length === 1 ? { column: columns[0] } : { columns }),
                    table: {
                        name: owningRelation.entityMetadata.tableName,
                        schema,
                    }
                }
            }
        }
    else if (tableType === "view")
        relationship = {
            name: relation.propertyName,
            using: {
                manual_configuration: {
                    column_mapping:
                        relation.joinColumns.reduce((result, column) => (
                            column.referencedColumn ?
                                { ...result, [column.propertyName]: column.referencedColumn.propertyName } : result
                        ), {}),
                    insertion_order: null, // what's this?
                    remote_table: {
                        name: relation.inverseEntityMetadata.tableName,
                        schema
                    }
                }
            }
        }
    else
        throw new Error("Relation tableType is not available")

    return { kind, relationship };
}

export function generateRelationships(relations: TypeORM.EntityMetadata['relations']):
    Pick<Hasura.MetadataTable, RelationshipKind> {
    const result: Required<Pick<Hasura.MetadataTable, RelationshipKind>> = {
        object_relationships: [],
        array_relationships: [],
    }

    // sort to be consistent with hasura
    relations.sort((a, b) => a.propertyName.localeCompare(b.propertyName));

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
