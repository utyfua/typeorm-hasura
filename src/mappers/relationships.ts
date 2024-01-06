import * as TypeORM from "typeorm";
import type * as Hasura from "hasura-metadata-types";

type RelationshipKind = 'object_relationships' | 'array_relationships'
type Relationship =
    | Hasura.LocalTableObjectRelationship
    | Hasura.SameTableObjectRelationship
    | Hasura.ManualObjectRelationship

export function generateRelationship(relation: TypeORM.EntityMetadata['relations'][number]): Relationship {
    const owningRelation = relation.isOwning ?
        relation : relation.inverseRelation;

    if (!owningRelation)
        throw new Error('Unable to find owning relation. Probably you have missed to set inverse side of the relation.');

    const columns = owningRelation.joinColumns.map(column => column.databaseName);

    // The schema doesn't defined for views by default but we can assume it's public
    const schema = owningRelation.entityMetadata.schema || 'public';

    const tableType = owningRelation.entityMetadata.tableType

    if (tableType === "regular" && relation.isOwning)
        return {
            name: relation.propertyName,
            using: {
                foreign_key_constraint_on: columns.length === 1 ? columns[0] : columns
            }
        }
    else if (tableType === "regular" && !relation.isOwning)
        return {
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
        return {
            name: relation.propertyName,
            using: {
                manual_configuration: {
                    column_mapping:
                        Object.fromEntries(relation.joinColumns
                            .filter(column => column.referencedColumn)
                            .map(column => [column.propertyName, column.referencedColumn!.propertyName])),
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
        if (relation.isManyToMany) {
            manyToManyWarning()
            continue
        }

        const kind = relation.relationType.endsWith('-to-one') ?
            'object_relationships' : 'array_relationships';
        const relationship = generateRelationship(relation);
        // @ts-ignore dont want to play with types for now
        result[kind].push(relationship);
    }

    return result;
}

let isManyToManyWarningShown = false
function manyToManyWarning() {
    if (isManyToManyWarningShown)
        return

    console.warn(new Error(
        'Typeorm-hasura does not support many-to-many relations yet, so we will skip such relationships. ' +
        'Also its possible that you have missed to set inverse side of the relation. ' +
        'If you want to help us to support many-to-many relations, please create an issue on github.'
    ));

    isManyToManyWarningShown = true
}