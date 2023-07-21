const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const bp = require("body-parser");
const cors = require("cors");

const db = require("../../db/auth.js")

router.use(bp.json());
router.use(cors());

router.post('/', async (req, res) => {
    const sql = 'INSERT INTO user(email,name,pw) VALUES (?,?,?)';
    const {email,name,pw} = req.body
    params = [email,name,pw]

    //암호화
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(params[2], salt)
    params[2] = hashPassword

    db.query(sql, params,(err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        res.json({success:true});
    });
});

module.exports = router