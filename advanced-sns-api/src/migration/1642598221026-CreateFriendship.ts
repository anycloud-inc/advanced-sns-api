import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateFriendship1642598221026 implements MigrationInterface {
    name = 'CreateFriendship1642598221026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`friendship\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`friendId\` int NOT NULL, \`level\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_303e50cd29767b99cc55ab45c1\` (\`userId\`), INDEX \`IDX_9372d39ed9833c770cb6d2c5cd\` (\`friendId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`friendship\` ADD CONSTRAINT \`FK_303e50cd29767b99cc55ab45c12\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`friendship\` ADD CONSTRAINT \`FK_9372d39ed9833c770cb6d2c5cd1\` FOREIGN KEY (\`friendId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`friendship\` DROP FOREIGN KEY \`FK_9372d39ed9833c770cb6d2c5cd1\``);
        await queryRunner.query(`ALTER TABLE \`friendship\` DROP FOREIGN KEY \`FK_303e50cd29767b99cc55ab45c12\``);
        await queryRunner.query(`DROP INDEX \`IDX_9372d39ed9833c770cb6d2c5cd\` ON \`friendship\``);
        await queryRunner.query(`DROP INDEX \`IDX_303e50cd29767b99cc55ab45c1\` ON \`friendship\``);
        await queryRunner.query(`DROP TABLE \`friendship\``);
    }

}
