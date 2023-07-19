const express = require('express');

const bp = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const db = require("./db/auth.js")

const app = express();
const port = 9000;

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
    const sql = 'INSERT INTO user(email,name,pw) VALUES (?,?,?)';
    const {email,name,pw} = req.body

    params = [email,name,pw]

    db.query(sql, params,(err, result) => {
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
