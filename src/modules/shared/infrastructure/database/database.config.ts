// shared/infrastructure/database/database.config.ts
import { registerAs } from '@nestjs/config';

export const DATABASE_CONFIG = 'database';

export default registerAs(DATABASE_CONFIG, () => ({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '', 10) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.schema{.ts,.js}'],
  synchronize: false,
}));
