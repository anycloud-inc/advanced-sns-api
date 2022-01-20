import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreatePostSeenLog1642660427877 implements MigrationInterface {
  name = 'CreatePostSeenLog1642660427877'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`post_seen_log\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NOT NULL, \`postId\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_12db20a61779596f066f49549b\` (\`userId\`, \`postId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`post_seen_log\` ADD CONSTRAINT \`FK_eeda493c6bccd429c23f268942b\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`post_seen_log\` ADD CONSTRAINT \`FK_6cff85dc118e7d963faeecc9199\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`post_seen_log\` DROP FOREIGN KEY \`FK_6cff85dc118e7d963faeecc9199\``
    )
    await queryRunner.query(
      `ALTER TABLE \`post_seen_log\` DROP FOREIGN KEY \`FK_eeda493c6bccd429c23f268942b\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_12db20a61779596f066f49549b\` ON \`post_seen_log\``
    )
    await queryRunner.query(`DROP TABLE \`post_seen_log\``)
  }
}
