const express = require('express');
const router = express.Router();
const bp = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken');

const db = require("../../../db/auth.js");
dotenv.config();

router.use(bp.json());
router.use(cors());
router.use(cookieParser());

// 토큰검증 미들웨어
router.post('/', authenticateToken, (req, res) => {
    res.json({Certification : true, message: '인증되었습니다.' });
});
async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    const refreshToken = req.body.refreshToken;

    if (token === undefined){
        return res.sendStatus(401).json({Certification : false, message : "사용 권한이 없습니다."})
    }

    const accessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403).json({Certification : false, message : "토큰 인증에 실패했습니다."});
        req.user = user;
        next();
    });

    const body = await checkRefreshTokenInDatabase(refreshToken);

    if (accessToken === null){
        if(body.refreshToken === undefined){ //두 토큰 모두 만료
            return res.sendStatus(401).json({Certification : false, message : "사용 권한이 없습니다."})
        } else{ //accessToken만 만료
            const newAccessToken = jwt.sign({userID : body.email._id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
            res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, maxAge: 900000 })
            return res.sendStatus(200).json({Certification : true, newAccessToken, message : "access 토큰 발급"})
        }
    } else {
        if (body.refreshToken === undefined){ //refreshToken만 만료
            const newRefreshToken = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '7d' })
            saveRefreshTokenToDatabase(body.email, refreshToken);
        } else{ //두 토큰 다 유효
            next();
        }
    }
}
async function checkRefreshTokenInDatabase(refreshToken) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM user WHERE refreshToken = ?';
        db.query(sql, [refreshToken], (err, rows) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            if (rows.length > 0) {
                console.log(rows[0]);
                resolve(rows[0]);
            } else {
                resolve(null);
            }
        });
    });
}


module.exports = router;
