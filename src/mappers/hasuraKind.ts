import type * as TypeORM from "typeorm";
import type * as Hasura from "../MetadataV3";

export function getHasuraKind(type: TypeORM.DataSourceOptions["type"]): Hasura.Source["kind"] {
    switch (type) {
        case "postgres":
            return "postgres";
        default:
            throw new Error(`Unsupported data source type ${type}.`);
    }
}
