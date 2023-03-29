import { CustomDataSourceOptions } from "../types";

// currently hasura does not support object in database url
export function getDatabaseUrl({ dataSource, databaseUrl }: CustomDataSourceOptions): string {
    if (databaseUrl) return databaseUrl;

    const { options } = dataSource;
    // check for postgres
    if (options.type !== "postgres") {
        throw new Error(`Unsupported data source type ${options.type}.`);
    }
    if (options.url) {
        return options.url
    }
    if (typeof options.password !== 'string') {
        throw new Error(`Does not support password as a function.`);
    }
    return `postgres://${options.username}:${options.password}@${options.host}:${options.port}/${options.database}`
}
