const { config } = require('dotenv');
const mysql = require('mysql2/promise');

config({ path: '.env' });
config({ path: '.env.test', override: true });

async function createTestDatabaseIfMissing() {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT || 3306);
  const appUsername = process.env.DB_USERNAME;
  const appPassword = process.env.DB_PASSWORD;
  const appUserHost = process.env.DB_USER_HOST || '%';
  const user =
    process.env.DB_ADMIN_USERNAME || process.env.MYSQL_ROOT_USERNAME || 'root';
  const password =
    process.env.DB_ADMIN_PASSWORD ||
    process.env.MYSQL_ROOT_PASSWORD ||
    process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!host || !user || !database) {
    throw new Error(
      'Missing required DB env vars. Ensure DB_HOST and DB_NAME are set in .env.test',
    );
  }

  if (!appUsername || !appPassword) {
    throw new Error(
      'Missing required DB app user env vars. Ensure DB_USERNAME and DB_PASSWORD are set in .env.test',
    );
  }

  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: false,
  });

  try {
    const escapedDatabase = `\`${database.replace(/`/g, '``')}\``;
    const escapedAppUsername = `\`${appUsername.replace(/`/g, '``')}\``;
    const escapedAppPassword = appPassword.replace(/'/g, "\\'");
    const escapedAppUserHost = appUserHost.replace(/'/g, "\\'");

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${escapedDatabase} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );

    await connection.query(
      `CREATE USER IF NOT EXISTS ${escapedAppUsername}@'${escapedAppUserHost}' IDENTIFIED BY '${escapedAppPassword}'`,
    );
    await connection.query(
      `GRANT ALL PRIVILEGES ON ${escapedDatabase}.* TO ${escapedAppUsername}@'${escapedAppUserHost}'`,
    );
    await connection.query('FLUSH PRIVILEGES');

    console.log(`Test database ready: ${database}`);
  } finally {
    await connection.end();
  }
}

createTestDatabaseIfMissing().catch((error) => {
  console.error(
    'Failed to prepare test database:',
    error.message,
    '\nHint: Set DB_ADMIN_USERNAME/DB_ADMIN_PASSWORD in .env.test with CREATE DATABASE and GRANT privileges.',
  );
  process.exit(1);
});
