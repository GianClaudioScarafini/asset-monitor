require('dotenv').config();
const pool = require('./src/db');

async function migrate() {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS readings (
            id SERIAL PRIMARY KEY,
            sensor_id TEXT NOT NULL,
            temperature REAL,
            humidity REAL,
            air_quality REAL,
            timestamp TIMESTAMPTZ DEFAULT NOW()
        )
    `);
    console.log('Table created');
    await pool.end();
}

migrate();