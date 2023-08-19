const express = require('express');
const router = express.Router();

const kakao_auth = require("./auth.js")
const qs = require('qs');
const cors = require("cors");
const axios = require('axios')

router.use(cors());

router.get('/login',(req,res)=>{
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_auth.clientID}&redirect_uri=${kakao_auth.redirectUri}&response_type=code&scope=profile_nickname,account_email`;
    res.redirect(kakaoAuthURL);
})

router.get('/oauth/callback', async(req,res)=>{
    //console.log("인증코드 확인 : ", req.query.code)
    try{//access토큰을 받기 위한 코드
        const data = {
            grant_type: 'authorization_code',
            client_id: kakao_auth.clientID,
            client_secret: kakao_auth.clientSecret,
            redirect_uri: kakao_auth.redirectUri,
            code: req.query.code,
        };
    
        token = await axios({
            method: 'POST',
            url: 'https://kauth.kakao.com/oauth/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: qs.stringify(data) // Convert data to a URL-encoded query string
        });
    }
    catch(err){
        console.error("Axios Error:", err.message);
        res.status(500).json({ error: 'Axios Request Error' });
    }
    
    let user;
    try{//access토큰을 받아서 사용자 정보를 알기 위해 쓰는 코드
        console.log("토큰확인 : ", token.data);//access정보를 가지고 또 요청해야 정보를 가져올 수 있음.
        user = await axios({
            method:'get',
            url:'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization: `Bearer ${token.data.access_token}`//헤더에 내용을 보고 보내줌
            }
        })
        
    }catch(e){
        console.error("Axios Error:", err.message);
        res.status(500).json({ error: 'Axios Request Error' });
    }
    
    console.log("유저 정보 : ",user.data);
    req.session.kakao = user.data;
    
    console.log(user.data.kakao_account.email)

    res.status(200).json({message : 'kakao login success'});
})

// router.get('/auth/info',(req,res)=>{
//     let {account_email, nickname,profile_image}=req.session.kakao.properties;
//     console.log(account_email, nickname, profile_image)
// })

module.exports = router