//requre the pakages exepree and get my databse from db file.
const config = require('dotenv').config()
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { checkCompliance } = require('./ai');

const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        res.status(401).json({ error: "wrong password or wrong username" })
    } else {
        try {
            jwt.verify(token, process.env.JWT_SECRET)
            next()
        } catch (error) {
            res.status(401).json({ error: "error" })
        }

    }
}

//store the on app all the entire express package under the const app
const app = express();

//alowed to express to read from different port
app.use(cors());

//middelrware that allowe to read row data
app.use(express.json());

// POST - receive sensor data
app.post('/readings', authenticate, async (req, res) => {

    // descrtururing the data for each columns that are on my databse 
    // the database will hadle the time stamps and the id
    const { sensor_id, temperature, humidity, air_quality } = req.body;

    // create a chath if the sensore dosent have an id retunr me with an error
    if (!sensor_id) {
        return res.status(400).json({ error: 'sensor_id is required' });
    }

    // here is a SQL comndad that allowed me to write on my databse the ? avoid SQL injection
    const result = await pool.query(
        'INSERT INTO readings (sensor_id, temperature, humidity, air_quality) VALUES ($1, $2, $3, $4) RETURNING id',
        [sensor_id, temperature, humidity, air_quality]
    );

    // this will notify the statuse of my system 
    res.status(201).json({ id: result.rows[0].id });
});

// GET - retrieve all readings

// this allowing me to get and read the data on my databse
app.get('/readings', authenticate, async (req, res) => {
    const result = await pool.query('SELECT * FROM readings ORDER BY timestamp DESC LIMIT 30');
    res.json(result.rows)
});
// port 3000 and waits for incoming requests.
app.listen(4000, () => {
    console.log('Server running on port 4000');
});

// GET - AI compliance report
app.get('/compliance', authenticate, async (req, res) => {
    const result = await pool.query('SELECT * FROM readings ORDER BY timestamp DESC LIMIT 10');
    const rows = result.rows;

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

app.get('/compliance/:sensor_id', authenticate, async (req, res) => {
    //do something
    const result = await pool.query('SELECT * FROM readings WHERE sensor_id = $1 ORDER BY timestamp DESC LIMIT 10', [req.params.sensor_id]);
    const rows = result.rows;
    if (rows.length === 0) {
        return res.status(400).json({ error: 'No readings found' });
    }

    try {
        const report = await checkCompliance(rows);
        res.json({ report });
    } catch (error) {
        res.status(500).json({ error: `Sensor_id: ${error.message}` })
    }
})

// POST /auth/login
app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body

    if (process.env.AUTH_USERNAME === username && process.env.AUTH_PASSWORD === password) {
        const paylod = { username }
        const secret = process.env.JWT_SECRET
        const option = { expiresIn: '1h' }
        const token = jwt.sign(paylod, secret, option)
        res.json({ token })

    } else {
        return res.status(401).json({ error: "wrong auth" })
    }

})

