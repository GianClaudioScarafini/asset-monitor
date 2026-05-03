//requre the pakages exepree and get my databse from db file.
const express = require('express');
const cors = require('cors');
const db = require('./db');
const { checkCompliance } = require('./ai');


//store the on app all the entire express package under the const app
const app = express();

//alowed to express to read from different port
app.use(cors());

//middelrware that allowe to read row data
app.use(express.json());

// POST - receive sensor data
app.post('/readings', (req, res) => {

    // descrtururing the data for each columns that are on my databse 
    // the database will hadle the time stamps and the id
    const { sensor_id, temperature, humidity, air_quality } = req.body;

    // create a chath if the sensore dosent have an id retunr me with an error
    if (!sensor_id) {
    return res.status(400).json({ error: 'sensor_id is required' });
    }

    // here is a SQL comndad that allowed me to write on my databse the ? avoid SQL injection
    const stmt = db.prepare(`
    INSERT INTO readings (sensor_id, temperature, humidity, air_quality)
    VALUES (?, ?, ?, ?)`);

    // actually push the inforamtion to my databse
    const result = stmt.run(sensor_id, temperature, humidity, air_quality);

    // this will notify the statuse of my system 
    res.status(201).json({ id: result.lastInsertRowid });
});

// GET - retrieve all readings

// this allowing me to get and read the data on my databse
app.get('/readings', (req, res) => {
  const rows = db.prepare('SELECT * FROM readings ORDER BY timestamp DESC LIMIT 30').all();
    res.json(rows);
});
// port 3000 and waits for incoming requests.
app.listen(4000, () => {
    console.log('Server running on port 4000');
});

// GET - AI compliance report
app.get('/compliance', async (req, res) => {
    const rows = db.prepare(
      'SELECT * FROM readings ORDER BY timestamp DESC LIMIT 10'
    ).all();

    if (rows.length === 0) {
        return res.status(400).json({ error: 'No readings found' });
    }
    try {
        const report = await checkCompliance(rows);
        res.json({ report });     
    } catch (error) {
        res.status(500).json({ error: `Anthropic API failed: ${error.message}` })
    }
});


// GET - retrieve compliance of the living room

app.get('/compliance/:sensor_id', async (req,res )=>{
    //do something
    const rows = db.prepare('SELECT * FROM readings WHERE sensor_id = ?  ORDER BY timestamp DESC LIMIT 10').all(req.params.sensor_id);
    if (rows.length === 0){
        return res.status(400).json({ error: 'No readings found' });        
    }

    try {
        const report = await checkCompliance(rows);
        res.json({ report });
    } catch (error) {
        res.status(500).json({ error: `Sensor_id: ${error.message}` })
    }
})