import {MigrationInterface, QueryRunner} from "typeorm";

export class CreatePostViewable1642591834212 implements MigrationInterface {
    name = 'CreatePostViewable1642591834212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`post_viewable\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`postId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_bc54fdcf61d6f40ff8d9d1fe76\` (\`userId\`, \`postId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post_viewable\` ADD CONSTRAINT \`FK_eb78b3ef1275935852a1bf5df17\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`post_viewable\` ADD CONSTRAINT \`FK_de213e60fb44e273d07a49fa858\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post_viewable\` DROP FOREIGN KEY \`FK_de213e60fb44e273d07a49fa858\``);
        await queryRunner.query(`ALTER TABLE \`post_viewable\` DROP FOREIGN KEY \`FK_eb78b3ef1275935852a1bf5df17\``);
        await queryRunner.query(`DROP INDEX \`IDX_bc54fdcf61d6f40ff8d9d1fe76\` ON \`post_viewable\``);
        await queryRunner.query(`DROP TABLE \`post_viewable\``);
    }

}
