import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateMessageReaction1642677773530 implements MigrationInterface {
  name = 'CreateMessageReaction1642677773530'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`message_reaction\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL, \`messageId\` int NOT NULL, \`userId\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, INDEX \`IDX_4418b4dacb57158842838039f3\` (\`messageId\`), INDEX \`IDX_2773f1753769d807ebbd2aa11d\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`message_reaction\` ADD CONSTRAINT \`FK_4418b4dacb57158842838039f30\` FOREIGN KEY (\`messageId\`) REFERENCES \`message\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`message_reaction\` ADD CONSTRAINT \`FK_2773f1753769d807ebbd2aa11df\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`message_reaction\` DROP FOREIGN KEY \`FK_2773f1753769d807ebbd2aa11df\``
    )
    await queryRunner.query(
      `ALTER TABLE \`message_reaction\` DROP FOREIGN KEY \`FK_4418b4dacb57158842838039f30\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_2773f1753769d807ebbd2aa11d\` ON \`message_reaction\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_4418b4dacb57158842838039f3\` ON \`message_reaction\``
    )
    await queryRunner.query(`DROP TABLE \`message_reaction\``)
  }
}
