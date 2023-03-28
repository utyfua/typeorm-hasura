import { getHasuraKind } from "./hasuraKind";

describe('mappers', () => {
    describe('hasuraKind', () => {
        it('should return postgres for postgres', () => {
            expect(getHasuraKind('postgres')).toEqual('postgres');
        });
        it('should throw for unsupported type', () => {
            expect(() => getHasuraKind('mysql')).toThrow();
        });
    });
})
