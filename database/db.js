import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
    user: 'admin',
    host: 'dpg-ckm2jfgu1l6c73ef7csg-a.oregon-postgres.render.com',
    database: 'labourdb',
    password: 'Max6nv4l1ZGM1Y5BAXx3wJ0tDPLcW05z',
    port: '5432',
    ssl: {
        rejectUnauthorized: false,
    },
});