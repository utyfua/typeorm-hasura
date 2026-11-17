import { MigrationInterface, QueryRunner } from "typeorm";

export class Next1782509308594 implements MigrationInterface {
    name = 'Next1782509308594'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" ADD "aliases" character varying array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "aliases"`);
    }

}
