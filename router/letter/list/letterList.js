const db = require('../../../models');

const Letter = db.letter;

const list = async (req, res) => {
    const { userId, deadline } = req.query;

    if (!userId || !deadline) {
        return res.status(400).json({ LetterList: false, message: "userId와 deadline을 모두 제공해야 합니다." });
    }

    try {
        const letters = await Letter.findAll({
            where: {
                userId: userId,
                deadline: deadline
            }
        });

        res.status(200).json({ LetterList: true, letters: letters });
    } catch (error) {
        console.error(error);
        res.status(500).json({ LetterList: false, message: "Server Error" });
    }
}

module.exports = list;
