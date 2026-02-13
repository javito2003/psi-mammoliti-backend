import { DataSource } from 'typeorm';
import { config } from 'dotenv';

const isTestEnv = process.env.NODE_ENV === 'test';

config({ path: '.env' });
config({ path: isTestEnv ? '.env.test' : '.env', override: true });

export default new DataSource({
  type: 'mysql',
  connectorPackage: 'mysql2',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '', 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/**/*.schema.ts'],
  migrations: ['src/modules/shared/infrastructure/database/migrations/*.ts'],
});
