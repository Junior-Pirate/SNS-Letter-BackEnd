const moment = require('moment');
const db = require('../../../models');

const Letter = db.letter;
const User = db.user;

const create = async (req, res) => {
    const { userId, nickname, title, content } = req.body;

    if (!userId) {
        return res.json({ LetterCreate: false, message: "userId를 입력하세요" });
    } else if (!nickname) {
        return res.json({ LetterCreate: false, message: "별명을 입력하세요" });
    } else if (!title) {
        return res.json({ LetterCreate: false, message: "제목을 입력하세요" });
    } else if (!content) {
        return res.json({ LetterCreate: false, message: "내용을 입력하세요" });
    }

    try {
        const user = await User.findOne({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(404).json({ LetterCreate: false, message: "해당 사용자는 존재하지 않습니다" });
        }

        //시간 계산
        const currentTime = moment();
        
        let startedAt = moment(user.startedAt);
        let finishedAt = moment(user.finishedAt);

        console.log(currentTime)
        console.log(startedAt)
        console.log(finishedAt)

        const day_6_before = startedAt.clone().add(1,"day");
        const day_5_before = startedAt.clone().add(2,"day");
        const day_4_before = startedAt.clone().add(3,"day");
        const day_3_before = startedAt.clone().add(4,"day");
        const day_2_before = startedAt.clone().add(5,"day");
        const day_1_before = startedAt.clone().add(6,"day");

        var day = 0

        if (currentTime.isBetween(startedAt, day_6_before)) {
            day = 6;
        } else if (currentTime.isBetween(day_6_before, day_5_before)) {
            day = 5;
        } else if (currentTime.isBetween(day_5_before, day_4_before)) {
            day = 4;
        } else if (currentTime.isBetween(day_4_before, day_3_before)) {
            day = 3;
        } else if (currentTime.isBetween(day_3_before, day_2_before)) {
            day = 2;
        } else if (currentTime.isBetween(day_2_before, day_1_before)) {
            day = 1;
        } else if (currentTime.isBetween(day_1_before, finishedAt)) {
            day = 0;
        }

        //console.log(day)

        const createdLetter = await Letter.create({
            nickname: nickname,
            title: title,
            content: content,
            userId: userId,
            deadline: day
        });

        res.status(201).json({ LetterCreate: true, message: "편지 작성이 완료되었습니다!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ LetterCreate: false, message: "Server Error" });
    }
}

module.exports = create;
