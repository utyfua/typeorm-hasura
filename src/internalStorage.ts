import { ColumnOptions, EntityOptions, ColumnMetadata, EntityTarget } from "./types";

export const internalStorage = {
    entityMetadata: new WeakMap<EntityTarget, EntityOptions<{}>>(),
    pushEntityOptions(target: EntityTarget, options: EntityOptions<{}>) {
        internalStorage.entityMetadata.set(target, options);
    },
    getEntityOptions<Entity extends Object = Object>(target: EntityTarget) {
        return internalStorage.entityMetadata.get(target) as EntityOptions<Entity> | undefined
},

    columnMetadata: [] as Array<ColumnMetadata>,
        pushColumnOptions(object: object, propertyName: string, options ?: ColumnOptions) {
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
