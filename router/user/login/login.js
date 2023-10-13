const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const db = require('../../../models');
const dotenv = require("dotenv");
dotenv.config();


const User = db.user;
const Token = db.token;

const login = async (req, res) => {
    const { email, pw } = req.body;

    if (email === "") {
        return res.json({ loginSuccess: false, message: "이메일을 입력하세요" });
    } else if (pw === "") {
        return res.json({ loginSuccess: false, message: "비밀번호를 입력하세요" });
    }

    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.json({ loginSuccess: false, message: '이메일 혹은 비밀번호가 틀립니다.' });
        }

        bcrypt.compare(pw, user.password, async (err, result) => {
            if (result) {
                const accessToken = jwt.sign({ userID: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
                
                const refreshToken = jwt.sign({ userID: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
                await saveRefreshTokenToDatabase(user.id, refreshToken);
                
                res.status(200)
                    .json({
                    loginSuccess: true,
                    accessToken,
                    message: "로그인 성공!"
                });
            } else {
                res.json({ loginSuccess: false, message: '이메일 혹은 비밀번호가 틀립니다.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

async function saveRefreshTokenToDatabase(userId, refreshToken) {
    try {
        let tokenInstance = await Token.findOne({
            where: {
                userId: userId
            }
        });

        if (!tokenInstance) {
            tokenInstance = await Token.create({
                userId: userId,
                tokenValue: refreshToken,
            });
        } else {
            await tokenInstance.update({ tokenValue: refreshToken });
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports = { login };