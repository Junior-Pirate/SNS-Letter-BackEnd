const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');
const db = require('../../models');

dotenv.config();

router.use(bodyParser.json());
router.use(cors());
router.use(cookieParser());

const User = db.user;
const Token = db.token;

// access 토큰을 재발급하는 미들웨어
const verifyAccessTokenReissue = async (req, res, next) => {
    if(req.headers['authorization'] && req.headers["refresh"]){
        const token = req.headers['authorization'].split(' ')[1];
        const refreshToken = req.headers["refresh"];
        
        //access 토큰 검증
        const accessResult = accessVerify(token);


        const decoded = jwt.decode(token);
        if(!decoded){
            res.status(401).send({result: false, message: "권한이 없습니다."})
        }

        console.log(decoded)

        //refresh 토큰 검증
        const refreshResult = await refreshVerify(refreshToken,decoded.userID);
    
        //access 토큰이 만료되었다면
        if(accessResult.ok === false && accessResult.message === "jwt expired"){
            //refresh 토큰도 만료
            if(refreshResult.ok === false){
                res.status(401).send({result: false, message: "다시 로그인해주세요."})
            }
            else{
                const newAccessToken = jwt.sign({ userID: decoded.userID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                
                res.status(200).send({
                    Certification: true, 
                    data:{
                        accessToken: newAccessToken,
                        refreshToken: refreshToken
                }})
            }
        } else { //access 토큰이 만료되지 않은 경우
            console.log(accessResult)
            res.status(400).send({result: false, message: "Access 토큰이 만료되지 않았습니다."})
        }
    } else{ //토큰이 헤더에 없는경우
        res.status(400).send({result: false, message: "토큰이 포함되어 있지 않습니다."})
    }
};

//access 토큰 검증
const accessVerify = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return {
            ok : true,
            userId : decoded.userId,
        };
    }
    catch(err){
        return{
            ok: false,
            message: err.message,
        }
    }
}

//refresh 토큰 검증
const refreshVerify = async (token, userId) => {
    try {
        const refreshData = await Token.findOne({
            where:{
                userId: userId
            }
        })
        console.log("refreshToken DB에서 찾기 : ",refreshData.dataValues.tokenValue)
        if(token === refreshData.dataValues.tokenValue){
            try{
                jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
                return {
                    ok: true,
                };
            } catch (err){
                return {
                    ok: false,
                    message: "인증 안됨",
                };
            }
        } else{
            return {
                ok: false,
                message: "토큰이 다름",
            };
        }
    } catch(err){
        return {
            ok: false,
            message: "서버 문제",
        };
    }
}

module.exports = { verifyAccessTokenReissue };
