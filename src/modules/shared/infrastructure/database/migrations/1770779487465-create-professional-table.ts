import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfessionalTable1770779487465 implements MigrationInterface {
  name = 'CreateProfessionalTable1770779487465';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`themes\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_0334884c335ef967c5dcff304f\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`professionals\` (\`id\` varchar(255) NOT NULL, \`user_id\` varchar(255) NOT NULL, \`bio\` text NOT NULL, \`price\` decimal(10,2) NOT NULL, \`timezone\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL, \`updatedAt\` timestamp NOT NULL, UNIQUE INDEX \`REL_11ce20e0e9f03ab6ce35e95a61\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`professional_themes\` (\`professional_id\` varchar(255) NOT NULL, \`theme_id\` varchar(36) NOT NULL, INDEX \`IDX_cabd277bd587a912f757689d79\` (\`professional_id\`), INDEX \`IDX_4dfc3a2165ea953d0f4f094648\` (\`theme_id\`), PRIMARY KEY (\`professional_id\`, \`theme_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`professionals\` ADD CONSTRAINT \`FK_11ce20e0e9f03ab6ce35e95a615\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`professional_themes\` ADD CONSTRAINT \`FK_cabd277bd587a912f757689d799\` FOREIGN KEY (\`professional_id\`) REFERENCES \`professionals\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
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
      `ALTER TABLE \`professional_themes\` DROP FOREIGN KEY \`FK_cabd277bd587a912f757689d799\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`professionals\` DROP FOREIGN KEY \`FK_11ce20e0e9f03ab6ce35e95a615\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4dfc3a2165ea953d0f4f094648\` ON \`professional_themes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_cabd277bd587a912f757689d79\` ON \`professional_themes\``,
    );
    await queryRunner.query(`DROP TABLE \`professional_themes\``);
    await queryRunner.query(
      `DROP INDEX \`REL_11ce20e0e9f03ab6ce35e95a61\` ON \`professionals\``,
    );
    await queryRunner.query(`DROP TABLE \`professionals\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_0334884c335ef967c5dcff304f\` ON \`themes\``,
    );
    await queryRunner.query(`DROP TABLE \`themes\``);
  }
}
