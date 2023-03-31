import { ColumnOptions, EntityOptions } from "./types";

type EntityTarget = any;

export const internalStorage = {
    entityMetadata: new WeakMap<EntityTarget, EntityOptions>(),
    pushEntityOptions(target: EntityTarget, options: EntityOptions) {
        internalStorage.entityMetadata.set(target, options);
    },
    getEntityOptions(target: EntityTarget) {
        return internalStorage.entityMetadata.get(target);
    },

    columnMetadata: [] as Array<{
        object: EntityTarget,
        propertyName: string,
        options: ColumnOptions | undefined,
    }>,
    pushColumnOptions(object: object, propertyName: string, options?: ColumnOptions) {
        internalStorage.columnMetadata.push({
            object,
            propertyName,
            options,
        });
    },
    getEntityColumnsOptionsList(target: EntityTarget) {
        return internalStorage.columnMetadata.filter(column => column.object.constructor === target);
    },
}
