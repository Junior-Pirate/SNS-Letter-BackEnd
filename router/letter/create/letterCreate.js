const express = require('express');
const db = require('../../../models');

const Letter = db.letter;


const create = async (req, res) => {

    //편지를 쓸 수 있는 시간인지 체크

    const { nickname, title, content } = req.body;
    const userId = req.userID;

    console.log("userId : ", userId)

    try {
        const createdLetter = await Letter.create({
            nickname: nickname,
            title: title,
            content: content,
            userId: userId
        });
        console.log(createdLetter)
        res.status(201).json({ success: true, message: "Letter created successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

module.exports = create;
