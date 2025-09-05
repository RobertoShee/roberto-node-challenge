import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasks1710000000000 implements MigrationInterface {
  name = 'CreateTasks1710000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "tasks" (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT,
        "titulo" varchar(100) NOT NULL,
        "descripcion" varchar(500),
        "status" varchar NOT NULL DEFAULT 'pendiente',
        "fecha_creacion" datetime NOT NULL DEFAULT (datetime('now')),
        "fecha_actualizacion" datetime NOT NULL DEFAULT (datetime('now'))
      );
    `);
    await queryRunner.query(`
      CREATE TRIGGER IF NOT EXISTS set_fecha_actualizacion
      AFTER UPDATE ON "tasks"
      FOR EACH ROW
      BEGIN
        UPDATE "tasks" SET "fecha_actualizacion" = datetime('now') WHERE "id" = NEW."id";
      END;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER IF EXISTS set_fecha_actualizacion;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks";`);
  }
}
