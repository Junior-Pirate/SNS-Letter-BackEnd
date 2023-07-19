const mysql = require('mysql');

const dbconf = {
    host:'localhost',
    user: 'root',
    password: 'tlsshrla2@',
    database:'sns_letter'
}
const db = mysql.createConnection(dbconf)

db.connect(function (err) {
    if (err) {
        console.log("Database connection failed");
        throw err;
    }
    console.log("Connected to the database");
});

module.exports = db;