import { MigrationInterface, QueryRunner } from "typeorm";

export class next1679166386871 implements MigrationInterface {
    name = 'next1679166386871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "hasura_zero"."User" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text, "orgId" uuid, CONSTRAINT "PK_9862f679340fb2388436a5ab3e4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hasura_zero"."Product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text, "orgId" uuid, "userId" uuid, CONSTRAINT "PK_9fc040db7872192bbc26c515710" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "hasura_zero"."Org" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text, CONSTRAINT "PK_cca1cae86d5c2eefca56675b245" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "hasura_zero"."User" ADD CONSTRAINT "FK_da2f97fadc32136438de8d6a7a7" FOREIGN KEY ("orgId") REFERENCES "hasura_zero"."Org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hasura_zero"."Product" ADD CONSTRAINT "FK_0426b5b66a3ad86d93237917bbf" FOREIGN KEY ("orgId") REFERENCES "hasura_zero"."Org"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "hasura_zero"."Product" ADD CONSTRAINT "FK_de75905c3b4987f4b5bb1472644" FOREIGN KEY ("userId") REFERENCES "hasura_zero"."User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hasura_zero"."Product" DROP CONSTRAINT "FK_de75905c3b4987f4b5bb1472644"`);
        await queryRunner.query(`ALTER TABLE "hasura_zero"."Product" DROP CONSTRAINT "FK_0426b5b66a3ad86d93237917bbf"`);
        await queryRunner.query(`ALTER TABLE "hasura_zero"."User" DROP CONSTRAINT "FK_da2f97fadc32136438de8d6a7a7"`);
        await queryRunner.query(`DROP TABLE "hasura_zero"."Org"`);
        await queryRunner.query(`DROP TABLE "hasura_zero"."Product"`);
        await queryRunner.query(`DROP TABLE "hasura_zero"."User"`);
    }
}
