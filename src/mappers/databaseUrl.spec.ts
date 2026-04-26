
import { DataSource } from "typeorm";
import { getDatabaseUrl } from "./databaseUrl";

describe('mappers', () => {
    describe('databaseUrl', () => {
        it('should return postgres for postgres', () => {
            const dataSource = new DataSource({
                type: 'postgres',
                host: 'localhost',
                port: 5432,
                username: 'test-user',
                password: 'test-password',
                database: 'test-database',
            });
            expect(getDatabaseUrl({
                name: 'default',
                dataSource
            })).toEqual('postgres://test-user:test-password@localhost:5432/test-database');
        });
        it('should throw for unsupported type', () => {
            const dataSource = new DataSource({
                type: 'sqljs',
                driver: {}
            });
            expect(() => getDatabaseUrl({
                name: 'default',
                dataSource
            })).toThrow();
        });
    });
})
