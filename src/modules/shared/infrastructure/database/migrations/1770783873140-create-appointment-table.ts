import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppointmentTable1770783873140 implements MigrationInterface {
    name = 'CreateAppointmentTable1770783873140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`appointments\` (\`id\` varchar(255) NOT NULL, \`professional_id\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`start_at\` timestamp NOT NULL, \`end_at\` timestamp NOT NULL, \`status\` enum ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'CONFIRMED', \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_60b7a60cf6727d87d525a750414\` FOREIGN KEY (\`professional_id\`) REFERENCES \`professionals\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`appointments\` ADD CONSTRAINT \`FK_66dee3bea82328659a4db8e54b7\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_66dee3bea82328659a4db8e54b7\``);
        await queryRunner.query(`ALTER TABLE \`appointments\` DROP FOREIGN KEY \`FK_60b7a60cf6727d87d525a750414\``);
        await queryRunner.query(`DROP TABLE \`appointments\``);
    }

}
