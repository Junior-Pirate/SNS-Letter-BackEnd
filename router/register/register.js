const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const bp = require("body-parser");
const cors = require("cors");

const db = require("../../db/auth.js")

router.use(bp.json());
router.use(cors());

router.post('/', async (req, res) => {
    const sql = 'SELECT email FROM user where email = ?'
    const {email,name,pw} = req.body
    params = [email,name,pw]

    //암호화
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(params[2], salt)
    params[2] = hashPassword

    db.query(sql, params[0],(err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        console.log(rows)
        if(rows.length==0){
            var sql = db.query('INSERT INTO user(email,name,pw) VALUES (?,?,?)',params,(err,result)=>{
                if(err) throw err;
                else{
                    res.status(200).json({message:'로그인 성공'})
                }
            })
        }
        if(rows.length!=0){
            res.status(401).json({message:'이메일이 중복되었습니다.'})
        }
    });
});

module.exports = router