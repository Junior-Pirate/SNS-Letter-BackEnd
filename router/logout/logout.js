const express = require('express');
const router = express.Router();
const bp = require("body-parser");

const db = require("../../db/auth.js"); 

router.use(bp.json());

router.post('/', async (req, res) => {
    const { email } = req.body;

    const refreshToken = await getRefreshTokenByEmail(email);
    if (refreshToken) {
        deleteRefreshTokenInDatabase(refreshToken);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: '로그아웃 되었습니다.' });
    } else {
        res.status(404).json({ message: '해당 사용자를 찾을 수 없거나 리프레시 토큰이 없습니다.' });
    }
});

async function getRefreshTokenByEmail(email) {
    // 이메일을 통해 리프레시 토큰을 확인하는 로직
    return new Promise((resolve, reject) => {
        const sql = 'SELECT refreshToken FROM user WHERE email = ?';
        db.query(sql, [email], (err, rows) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            if (rows.length > 0) {
                resolve(rows[0].refreshToken);
            } else {
                resolve(null);
            }
        });
    });
}

async function deleteRefreshTokenInDatabase(refreshToken) {
    // 데이터베이스에서 리프레시 토큰 삭제 로직
    const sql = 'UPDATE user SET refreshToken = NULL WHERE refreshToken = ?';
    db.query(sql, [refreshToken], (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("리프레시 토큰이 데이터베이스에서 삭제되었습니다.");
    });
}

module.exports = router;
