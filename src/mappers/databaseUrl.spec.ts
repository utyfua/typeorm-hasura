
import { getDatabaseUrl } from "./databaseUrl";

describe('mappers', () => {
    describe('databaseUrl', () => {
        it('should return postgres for postgres', () => {
            expect(getDatabaseUrl({
                dataSource: {
                    name: 'default',
                    // @ts-ignore
                    type: 'postgres',
                    options: {
                        type: 'postgres',
                        host: 'localhost',
                        port: 5432,
                        username: 'test-user',
                        password: 'test-password',
                        database: 'test-database',
                    }
                }
            })).toEqual('postgres://test-user:test-password@localhost:5432/test-database');
        });
        it('should throw for unsupported type', () => {
            expect(() => getDatabaseUrl({
                dataSource: {
                    name: 'default',
                    // @ts-ignore
                    type: 'mysql',
                }
            })).toThrow();
        });
    });
})
