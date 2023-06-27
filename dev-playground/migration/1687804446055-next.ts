import { MigrationInterface, QueryRunner } from "typeorm";

export class Next1687804446055 implements MigrationInterface {
    name = 'Next1687804446055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE VIEW "UserView" AS SELECT "User"."id" AS "id", "User"."name" AS "name", "User"."orgId" AS "orgId", "User"."testJsonB" AS "testJsonB" FROM "public"."User" "User"`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","UserView","SELECT \"User\".\"id\" AS \"id\", \"User\".\"name\" AS \"name\", \"User\".\"orgId\" AS \"orgId\", \"User\".\"testJsonB\" AS \"testJsonB\" FROM \"public\".\"User\" \"User\""]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","UserView","public"]);
        await queryRunner.query(`DROP VIEW "UserView"`);
    }

}
