import { MigrationInterface, QueryRunner } from "typeorm";

export class next1682340684100 implements MigrationInterface {
    name = 'next1682340684100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" ADD "testJsonB" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "testJsonB"`);
    }

}
