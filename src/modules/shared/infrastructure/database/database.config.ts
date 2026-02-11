import { registerAs } from '@nestjs/config';

export const DATABASE_CONFIG = 'database';

export default registerAs(DATABASE_CONFIG, () => ({
  type: 'mysql',
  connectorPackage: 'mysql2',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '', 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  migrationsRun: true,
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
}));
