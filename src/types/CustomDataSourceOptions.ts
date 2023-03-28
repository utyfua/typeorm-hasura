import * as TypeORM from "typeorm";
import * as Hasura from "../MetadataV3";

export interface CustomDataSourceOptions {
    name: string;
    dataSource: TypeORM.DataSource;
    customization?: Hasura.SourceCustomization;
    /**
     * override database url instead of url from data source
     *
     * @example `postgres://username:password@host:5432/database`
     * @deprecated please rely on the `dataSource` parameter instead
     */
    databaseUrl?: string;
}
