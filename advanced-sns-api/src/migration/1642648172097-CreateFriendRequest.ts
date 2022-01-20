import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateFriendRequest1642648172097 implements MigrationInterface {
  name = 'CreateFriendRequest1642648172097'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`friend_request\` (\`id\` int NOT NULL AUTO_INCREMENT, \`senderId\` int NOT NULL, \`receiverId\` int NOT NULL, \`status\` enum ('Requesting', 'Accepted', 'Declined') NOT NULL DEFAULT 'Requesting', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, INDEX \`IDX_9509b72f50f495668bae3c0171\` (\`senderId\`), INDEX \`IDX_470e723fdad9d6f4981ab2481e\` (\`receiverId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`friend_request\` ADD CONSTRAINT \`FK_9509b72f50f495668bae3c0171c\` FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`friend_request\` ADD CONSTRAINT \`FK_470e723fdad9d6f4981ab2481eb\` FOREIGN KEY (\`receiverId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`friend_request\` DROP FOREIGN KEY \`FK_470e723fdad9d6f4981ab2481eb\``
    )
    await queryRunner.query(
      `ALTER TABLE \`friend_request\` DROP FOREIGN KEY \`FK_9509b72f50f495668bae3c0171c\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_470e723fdad9d6f4981ab2481e\` ON \`friend_request\``
    )
    await queryRunner.query(
      `DROP INDEX \`IDX_9509b72f50f495668bae3c0171\` ON \`friend_request\``
    )
    await queryRunner.query(`DROP TABLE \`friend_request\``)
  }
}
