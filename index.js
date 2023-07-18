const express = require('express');
const mysql = require('mysql');
const bp = require("body-parser");
const cors = require("cors");

const dbconf = require("./conf/auth.js")

const app = express();
const port = 9000;

const db = mysql.createConnection(dbconf)
db.connect(function (err) {
    if (err) {
        console.log("Database connection failed");
        throw err;
    }
    console.log("Connected to the database");
});

app.use(bp.json());
app.use(cors());



app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/test', (req, res) => {
    const sql = 'SELECT * FROM user';

    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        console.log(result);
        res.json(result);
    });
});

app.post('/test', (req, res) => {
    const sql = 'INSERT INTO user(name) VALUES (?)';
    const name = req.body.name

    console.log(name);

    db.query(sql, name,(err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        res.json({success:true});
    });
});

app.listen(port, () => {
    console.log('App listening on port ' + port);
});
