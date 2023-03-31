import { internalStorage } from "../internalStorage";
import { EntityOptions } from "../types";

export function Entity<Entity extends Object>(options: EntityOptions<Entity>): ClassDecorator {
    return (target: object) => {
        internalStorage.pushEntityOptions(target, options);
    };
}

export {
    Entity as HasuraEntity,
}
