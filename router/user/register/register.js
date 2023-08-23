const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");

const db = require('../../../models')

router.use(express.json());
const User = db.user;

router.post('/', async (req, res) => {
    const {email,name,pw, again_pw} = req.body


    //빈값이면 반환
    if( email === "" ){
        return res.json({ registerSuccess: false, message: "이메일을 입력하세요" });
    }
    else if(name === "" ){
        return res.json({ registerSuccess: false, message: "이름을 입력하세요" });
    }
    else if(pw === ""){
        return res.json({ registerSuccess: false, message: "비밀번호를 입력하세요" });
    }
    else if(again_pw === ""){
        return res.json({ registerSuccess: false, message: "비밀번호 확인란을 입력하세요" });
    }

    //비밀번호 일치 여부
    if(pw != again_pw){
        return res.json({registerSuccess: false, message: "비밀번호가 같지 않습니다."})
    }

    try{
        //암호화
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(pw, salt)

        const existingUser = await User.findOne({
            where: {
                email: email
            }
        })

        if(existingUser) {
            return res.status(401).json({registerSuccess: false, message:'이메일이 중복되었습니다.'})
        }

        //사용자 생성
        await User.create({
            email: email,
            name: name,
            password: hashPassword
        })

        res.status(200).json({registerSuccess: true, message:'회원가입 성공'})
    } catch (error){
        console.error(error)
        res.status(500).json({ error: 'Server Error' });
    }
});

module.exports = router