import * as TypeORM from "typeorm";
import type * as Hasura from "hasura-metadata-types";

export interface DataSourceOptions {
    name: string;
    dataSource: TypeORM.DataSource;
    customizationNative?: Hasura.SourceCustomization;

    /**
     * override database url instead of url from data source
     *
     * @example `postgres://username:password@host:5432/database`
     * @deprecated please rely on the `dataSource` parameter instead
     */
    databaseUrl?: string;

    /**
     * Set limit on number of rows fetched per request by default for all entities
     * @default undefined
     */
    defaultSelectPermissionLimit?: number;
}
