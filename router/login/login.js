const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const bp = require("body-parser");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const jwt = require('jsonwebtoken'); // 추가

const db = require("../../db/auth.js");
dotenv.config();

router.use(bp.json());
router.use(cors());
router.use(cookieParser());



router.post('/', async (req, res) => {
    const sql = 'SELECT * FROM user WHERE email = ?';
    const { email, pw } = req.body;
    const params = [email, pw];

    if(email === ""){
        return res.json({ loginSuccess: false, message: "이메일을 입력하세요" });
    }
    else if(pw === ""){
        return res.json({ loginSuccess: false, message: "비밀번호를 입력하세요" });
    }

    // email check
    db.query(sql, params[0], (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        if (rows.length > 0) {
            bcrypt.compare(params[1], rows[0].pw, (err, result) => {
                if (result) {
                    const accessToken = jwt.sign({ userID: rows[0]._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, maxAge: 900000 });
                    
                    const refreshToken = jwt.sign({ userID: rows[0]._id }, process.env.REFRESH_TOKEN_SECRET,{ expiresIn: '7d' });
                    saveRefreshTokenToDatabase(params[0], refreshToken);

                    res.status(200).json({ 
                        loginSuccess: true,
                        accessToken, 
                        refreshToken ,
                        message:"로그인성공!"});

                } else {
                    res.status(401).json({ loginSuccess: false, message: '이메일 혹은 비밀번호가 틀립니다.' });
                }
            });
        } else {
            res.status(401).json({ loginSuccess: false, message: '이메일 혹은 비밀번호가 틀립니다.' });
        }
    });
});
function saveRefreshTokenToDatabase(email, refreshToken){
    const sql = 'UPDATE user SET refreshToken = ? WHERE email = ?';
    db.query(sql, [refreshToken, email], (err, res) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
            return;
        }
        console.log("refrsesh token db저장")
    });
}

// 토큰검증 미들웨어
router.post('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route.' });
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
