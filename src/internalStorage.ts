import { MetadataUtils } from 'typeorm/metadata-builder/MetadataUtils'
import { ColumnOptions, EntityOptions, ColumnMetadata, EntityTarget, EntityInternalStorageWorkspace } from "./types";

export const internalStorage = {
    entityMetadata: new WeakMap<EntityTarget, EntityOptions<{}>>(),
    pushEntityOptions(target: EntityTarget, options: EntityOptions<{}>) {
        internalStorage.entityMetadata.set(target, options);
    },

    columnMetadata: [] as Array<ColumnMetadata>,
    pushColumnOptions(object: object, propertyName: string, options?: ColumnOptions) {
        internalStorage.columnMetadata.push({
            object,
            propertyName,
            options,
        });
    },

    getEntityWorkspace<Entity extends Object = Object>(target: EntityTarget): EntityInternalStorageWorkspace<Entity> {
        console.log({
            entityOptions: internalStorage.entityMetadata.get(target) as EntityOptions<Entity> | undefined,
            columnMetadata: internalStorage.columnMetadata.filter(column => column.object.constructor === target),
        })
        const inheritanceTree = MetadataUtils.getInheritanceTree(target)
        return {
            entityOptions: internalStorage.entityMetadata.get(target) as EntityOptions<Entity> | undefined,
            columnMetadata: internalStorage.columnMetadata.filter(column => inheritanceTree.includes(column.object.constructor)),
        }
    }
}
