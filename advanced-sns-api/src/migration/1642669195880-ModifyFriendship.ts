import { MigrationInterface, QueryRunner } from 'typeorm'

export class ModifyFriendship1642669195880 implements MigrationInterface {
  name = 'ModifyFriendship1642669195880'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`friendship\` ADD \`deletedAt\` datetime(6) NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`friendship\` DROP COLUMN \`deletedAt\``
    )
  }
}
