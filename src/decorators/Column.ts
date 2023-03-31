import { internalStorage } from "../internalStorage";
import { ColumnOptions } from "../types";

export function Column(options?: ColumnOptions): Function {
    return function (object: Object, propertyName: string) {
        internalStorage.pushColumnOptions(object, propertyName, options);
    };
}

export {
    Column as HasuraColumn,
}
