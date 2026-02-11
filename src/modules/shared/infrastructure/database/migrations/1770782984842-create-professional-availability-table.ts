import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfessionalAvailabilityTable1770782984842 implements MigrationInterface {
  name = 'CreateProfessionalAvailabilityTable1770782984842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`professional_availabilities\` (\`id\` varchar(255) NOT NULL, \`professional_id\` varchar(255) NOT NULL, \`dayOfWeek\` int NOT NULL, \`block\` enum ('MORNING', 'AFTERNOON', 'EVENING') NOT NULL, \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` DROP FOREIGN KEY \`FK_4dfc3a2165ea953d0f4f0946480\``,
    );
    await queryRunner.query(`ALTER TABLE \`themes\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`themes\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`themes\` ADD \`id\` varchar(255) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` ADD PRIMARY KEY (\`professional_id\`)`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4dfc3a2165ea953d0f4f094648\` ON \`professional_themes\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` DROP COLUMN \`theme_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` ADD \`theme_id\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` ADD PRIMARY KEY (\`professional_id\`, \`theme_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_4dfc3a2165ea953d0f4f094648\` ON \`professional_themes\` (\`theme_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_availabilities\` ADD CONSTRAINT \`FK_8387355a3f30b751af33b86418b\` FOREIGN KEY (\`professional_id\`) REFERENCES \`professionals\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` ADD CONSTRAINT \`FK_4dfc3a2165ea953d0f4f0946480\` FOREIGN KEY (\`theme_id\`) REFERENCES \`themes\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` DROP FOREIGN KEY \`FK_4dfc3a2165ea953d0f4f0946480\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_availabilities\` DROP FOREIGN KEY \`FK_8387355a3f30b751af33b86418b\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4dfc3a2165ea953d0f4f094648\` ON \`professional_themes\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` ADD PRIMARY KEY (\`professional_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` DROP COLUMN \`theme_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` ADD \`theme_id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_4dfc3a2165ea953d0f4f094648\` ON \`professional_themes\` (\`theme_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` ADD PRIMARY KEY (\`professional_id\`, \`theme_id\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`themes\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`themes\` ADD \`id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`themes\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` ADD CONSTRAINT \`FK_4dfc3a2165ea953d0f4f0946480\` FOREIGN KEY (\`theme_id\`) REFERENCES \`themes\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(`DROP TABLE \`professional_availabilities\``);
  }
}
