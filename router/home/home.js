const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const bp = require("body-parser");
const cors = require("cors");

const db = require("../../db/auth.js")

router.use(bp.json());
router.use(cors());

router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM user';
    
    //email check
    db.query(sql, (err,row)=>{
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        res.json(row); 
    });
});

router.post('/', async (req, res) => {
    const sql = 'SELECT * FROM user WHERE email = ?';
    const email = req.body.email

    db.query(sql, email,(err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        res.json({success:true});
    });
});

module.exports = router