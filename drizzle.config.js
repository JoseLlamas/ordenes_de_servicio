import { defineConfig } from 'drizzle-kit';

const connectionString = `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DATABASE}`;

export default defineConfig({
  schema: './src/lib/server/db/schema.js',
  dialect: 'mysql',
  dbCredentials: {
    url: connectionString
  },
  verbose: true,
  strict: true
});
