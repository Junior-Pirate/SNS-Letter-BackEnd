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

// 리프레시 토큰을 이용하여 엑세스 토큰 재발급
router.post('/token', async (req, res) => {
    const refreshToken = req.body.refreshToken;
    
    const isValidRefreshToken = await checkRefreshTokenInDatabase(refreshToken);
    if (isValidRefreshToken) {
        const newAccessToken = jwt.sign({userID : "user"}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.sendStatus(200).json({tokenReissue : true, accessToken: newAccessToken });
    } else {
        res.sendStatus(403).json({tokenReissue : false , message : "Refresh Token이 유효하지 않습니다. 다시 로그인하세요."});
    }
});
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
                //console.log(rows[0].refreshToken);
                resolve(rows[0]);
            } else {
                resolve(null);
            }
        });
    });
}

// 토큰검증 미들웨어
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route.' });
});
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = router;
