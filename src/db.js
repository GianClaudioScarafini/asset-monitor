const Database = require('better-sqlite3');

const db = new Database('asset-monitor.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sensor_id TEXT NOT NULL,
    temperature REAL,
    humidity REAL,
    air_quality REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;