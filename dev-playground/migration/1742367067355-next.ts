import { MigrationInterface, QueryRunner } from "typeorm";

export class Next1742367067355 implements MigrationInterface {
    name = 'Next1742367067355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Org" ADD "isPublic" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Org" DROP COLUMN "isPublic"`);
    }

}
