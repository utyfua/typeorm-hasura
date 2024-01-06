import * as TypeORM from "typeorm";
import type * as Hasura from "hasura-metadata-types";

export interface DataSourceOptions {
    name: string;
    dataSource: TypeORM.DataSource;
    customizationNative?: Hasura.SourceCustomization;

    /**
     * Override database url instead of url from data source
     * 
     * Should refer to the database that Hasura will use to connect to the database from inside the container of Hasura.
     * 
     * Can omit if you are using the same database for Hasura and TypeORM.
     *
     * @example `postgres://username:password@host:5432/database`
     */
    databaseUrl?: string;

    /**
     * Set limit on number of rows fetched per request by default for all entities
     * @default undefined
     */
    defaultSelectPermissionLimit?: number;
}
