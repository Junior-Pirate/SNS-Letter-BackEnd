const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const bp = require("body-parser");
const cors = require("cors");

const db = require("../../db/auth.js")

router.use(bp.json());
router.use(cors());

router.post('/', async (req, res) => {
    const sql = 'SELECT * FROM user WHERE email = ?';
    const {email,pw} = req.body
    params = [email,pw]
    
    //email check
    db.query(sql, params[0], (err,row)=>{
        console.log(params[0])
        console.log(row)
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        if (row.length > 0) {
            //db check
            bcrypt.compare(params[1], row[0].pw,(err,result)=>{
                if(result){
                    console.log("login succeed!")
                    res.json({success:true})
                }
                else{
                    console.log("login failed!")
                    res.json({success:false})
                }
            })
          } else {
            console.log("Email does not exist")
            res.json({ exists: false });
          }
    })

});

module.exports = router