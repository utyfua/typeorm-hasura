import { internalStorage } from "../internalStorage";
import { EntityOptions } from "../types";

export function Entity(options: EntityOptions): ClassDecorator {
    return (target: object) => {
        internalStorage.pushEntityOptions(target, options);
    };
}

export {
    Entity as HasuraEntity,
}
