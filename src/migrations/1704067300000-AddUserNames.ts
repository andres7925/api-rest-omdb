import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddUserNames1704067300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('users', [
      new TableColumn({
        name: 'firstName',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'lastName',
        type: 'varchar',
        isNullable: true,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('users', ['firstName', 'lastName']);
  }
} 