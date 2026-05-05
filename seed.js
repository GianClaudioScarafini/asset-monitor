const Database = require('better-sqlite3');
const db = new Database('asset-monitor.db');

const sensors = ['living-room', 'bedroom', 'kitchen'];

const stmt = db.prepare(`
    INSERT INTO readings (sensor_id, temperature, humidity, air_quality, timestamp)
    VALUES (?, ?, ?, ?, ?)
`);

// Generate 50 readings per room over the last 24 hours
sensors.forEach(sensor => {
    for (let i = 0; i < 50; i++) {
        const minutesAgo = i * 30;
        const timestamp = new Date(Date.now() - minutesAgo * 60 * 1000)
            .toISOString()
            .replace('T', ' ')
            .substring(0, 19);

        const temperature = (18 + Math.random() * 8).toFixed(1);
        const humidity = (40 + Math.random() * 30).toFixed(1);
        const air_quality = Math.floor(70 + Math.random() * 80);

        stmt.run(sensor, temperature, humidity, air_quality, timestamp);
    }
});

console.log('Database seeded with 150 readings across 3 rooms');