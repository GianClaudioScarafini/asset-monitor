require('dotenv').config();
const pool = require('./src/db');

const sensors = ['living-room', 'bedroom', 'kitchen'];

async function seed() {
    for (const sensor of sensors) {
        for (let i = 0; i < 50; i++) {
            const minutesAgo = i * 30;
            const timestamp = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
            const temperature = (18 + Math.random() * 8).toFixed(1);
            const humidity = (40 + Math.random() * 30).toFixed(1);
            const air_quality = Math.floor(70 + Math.random() * 80);

            await pool.query(
                'INSERT INTO readings (sensor_id, temperature, humidity, air_quality, timestamp) VALUES ($1, $2, $3, $4, $5)',
                [sensor, temperature, humidity, air_quality, timestamp]
            );
        }
    }
    console.log('Seeded 150 readings across 3 rooms');
    await pool.end();
}

seed();
