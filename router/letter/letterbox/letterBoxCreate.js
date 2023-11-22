const moment = require('moment');
const bcrypt = require('bcrypt');
const db = require('../../../models');

const User = db.user;

const letterBoxCreate = async (req, res) => {
    //auth 권한 체크 후 받아옴.
    const userId = req.userID;
    try {
        const user = await User.findOne({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.json({ LetterBoxCreate: false, message: "해당 사용자는 존재하지 않습니다" });
        }

        if (user.letterbox === true) {
            return res.json({ LetterBoxCreate: false, message: "이미 편지함이 존재합니다" });
        }
        
        //이걸 프론트엔드에서 처리한 뒤에 백엔드로는 userId를 보내줘야 할듯
        const hashedUserId = await bcrypt.hash(userId.toString(), 10);

        await User.update(
        {
            startedAt: moment(),
            finishedAt: moment(moment()).add(7, 'days'),
            letterbox: true,
        },
        {
            where : {id: userId}
        })
        
        return res.status(200).json({LetterBoxCreate: true, message: "편지함 생성에 성공했습니다!", userId : userId});
    } catch (error) {
        console.error(error);
        return res.json({LetterBoxCreate: false, message: "편지함 생성 실패 - 서버 문제"});
    }
};


module.exports = letterBoxCreate;
