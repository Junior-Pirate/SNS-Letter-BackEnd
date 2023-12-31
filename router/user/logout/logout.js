const express = require('express');
const router = express.Router();
const bp = require("body-parser");
const db = require('../../../models');

router.use(bp.json());

const User = db.user;
const Token = db.token;

const logout = async (req, res) => {
    const userId = req.userID;
    try {
        const user = await User.findOne({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(401).json({ message: '해당 사용자를 찾을 수 없습니다.' });
        }

        const refreshToken = await getRefreshTokenByUserId(userId);

        if (refreshToken) {
            await deleteRefreshTokenInDatabase(refreshToken);
        }
        
        res.status(200).json({ message: '로그아웃 되었습니다.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

async function getRefreshTokenByUserId(userId) {
    try {
        const token = await Token.findOne({
            where: {
                userId: userId
            }
        });
        return token ? token.tokenValue : null;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function deleteRefreshTokenInDatabase(refreshToken) {
    try {
        await Token.destroy({
            where: {
                tokenValue: refreshToken
            }
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {logout};
