const express = require('express');
const db = require('../../models');
const jwt = require('jsonwebtoken');

const User = db.user;

const auth = async (req, res, next) => {
    if(req.headers['authorization']){
        const token = req.headers['authorization'].split(' ')[1];

        const accessResult = accessVerify(token);
        
        const decoded = jwt.decode(token);
        if(!decoded){
            return res.state(403).send({auth: false, message: "권한이 없습니다."})
        }

        if(accessResult.ok === false && accessResult.message === "jwt expired"){
            return res.state(401).send({auth: false, message: "Access 토큰이 만료되었습니다.(refresh)"})
        }
        const userResult = await findUser(decoded.userID)
        if(userResult.ok === true){
            req.userID = decoded.userID
            next();
        }
    } else{ //토큰이 헤더에 없는경우
        return res.state(404).send({auth: false, message: "토큰이 포함되어 있지 않습니다."})
    }
}

const accessVerify = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return {
            ok : true
        };
    }
    catch(err){
        return{
            ok: false,
            message: err.message,
        }
    }
}

const findUser = async (userId) => {
    try {
        const userData = await User.findOne({
            where:{
                id: userId
            }
        })
        if (userData) {
            return {
                ok: true,
                name: userData.dataValues.name
            };
        } else {
            return {
                ok: false,
                message: "사용자를 찾을 수 없습니다."
            };
        }
    } catch(err){
        return {
            ok: false,
            message: "서버 문제",
        };
    }
}

module.exports = { auth };