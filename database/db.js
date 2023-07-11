import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
    user: 'admin',
    host: 'dpg-cimq6i5gkuvotpjfggeg-a.oregon-postgres.render.com',
    database: 'laboursdb',
    password: 'n9UJe8afa5pyUNncuJ39MjD2wCt3nVq7',
    port: '5432',
    ssl: {
        rejectUnauthorized: false,
    },
});