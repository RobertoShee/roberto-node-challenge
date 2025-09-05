import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Task } from '../modules/tasks/task.entity';
import { loadEnv } from './env';

const env = loadEnv();

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: env.DB_PATH ?? 'data/dev.db',
    entities: [Task],
    migrations: ['dist/src/db/migrations/*.js'],
    synchronize: true,
    logging: env.DB_LOGGING === 'true',
});
