const express = require('express');
const db = require('../../../models');

const Letter = db.letter;
const User = db.user;

const create = async (req, res) => {

    const { nickname, title, content } = req.body;
    const userId = req.userID;

    if (nickname === "") {
        return res.json({ loginSuccess: false, message: "별명을 입력하세요" });
    } else if (title === "") {
        return res.json({ loginSuccess: false, message: "제목을 입력하세요" });
    } else if (content === "") {
        return res.json({ loginSuccess: false, message: "내용을 입력하세요" });
    }

    console.log("userId : ", userId)

    try {
        const user = await User.findOne({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.json({ success: false, message: "해당 사용자는 존재하지 않습니다" });
        }

        const createdLetter = await Letter.create({
            nickname: nickname,
            title: title,
            content: content,
            userId: userId
        });
        console.log(createdLetter)
        res.status(201).json({ success: true, message: "편지 작성이 완료되었습니다!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

module.exports = create;
