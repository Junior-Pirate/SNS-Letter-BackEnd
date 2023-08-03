const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const bp = require("body-parser");
const cors = require("cors");
//const cookieParser = require('cookie-parser');

const db = require("../../db/auth.js")

router.use(bp.json());
router.use(cors());
//router.use(cookieParser());

router.post('/', async (req, res) => {
    const sql = 'SELECT * FROM user WHERE email = ?';
    const {email,pw} = req.body
    params = [email,pw]
    
    //email check
    db.query(sql, params[0], (err,rows)=>{
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        if (rows.length > 0) {
            //db check
            bcrypt.compare(params[1], rows[0].pw,(err,result)=>{
                if(result){
                    // res.cookie("user",email,{
                    //     expires: new Date(Date.now() + 900000),
                    //     httpOnly: true
                    // })
                    res.status(200).json({message:'로그인 성공!'})
                }
                else{
                    res.status(401).json({message:'이메일 혹은 비밀번호가 틀립니다.'})
                }
            })
          }
          if(rows.length==0){
            res.status(401).json({message:'이메일 혹은 비밀번호가 틀립니다.'});
          }
    })

});

module.exports = router