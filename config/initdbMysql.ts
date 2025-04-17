// initdbMysql.ts
import { config } from 'dotenv';
import mysql from 'mysql2/promise';

config(); // Memuat environment variables

const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    namedPlaceholders: true,
    bigNumberStrings: true,
    supportBigNumbers: true
});

export { dbPool }; // Export dbPool
