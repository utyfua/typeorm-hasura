import "reflect-metadata"
import { DataSource } from "typeorm"
import * as entities from "./entity"

const { DB_URL, DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_SCHEMA } = process.env

export const AppDataSource = new DataSource({
    type: "postgres",
    url: DB_URL,
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    schema: DB_SCHEMA,
    synchronize: false,
    logging: false,
    entities: Object.values(entities),
    migrations: ['./dev-playground/migration/*.ts'],
    subscribers: [],
})
