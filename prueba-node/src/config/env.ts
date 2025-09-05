import * as dotenv from 'dotenv';
dotenv.config();

export function loadEnv() {
  return {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    PORT: Number(process.env.PORT ?? 3000),
    DB_PATH: process.env.DB_PATH,
    DB_LOGGING: process.env.DB_LOGGING ?? 'false',
    CORS_ORIGINS: process.env.CORS_ORIGINS ?? '*',
  };
}
