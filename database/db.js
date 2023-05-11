import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
    user: 'project1',
    host: 'dpg-chdqdvrhp8u3v73ln07g-a.oregon-postgres.render.com',
    database: 'project1_36v1',
    password: 'NXhqZ0aayBwDgbDAfy3lnoRWkjdn1TIp',
    port: '5432',
    ssl: {
        rejectUnauthorized: false,
    },
});