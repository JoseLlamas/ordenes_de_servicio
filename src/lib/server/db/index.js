import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';
import * as env from '$env/static/private';

const uri = `mysql://${env.MYSQL_USER}:${env.MYSQL_PASSWORD}@${env.MYSQL_HOST}:${env.MYSQL_PORT}/${env.MYSQL_DATABASE}`;

const client = mysql.createPool({
  uri,
  timezone: '+00:00',
  charset: 'utf8mb4'
});

export const db = drizzle(client, { schema, mode: 'default' });
