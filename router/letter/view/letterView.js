const db = require('../../../models');

const Letter = db.letter;

const viewLetter = async (req, res) => {
    //auth 권한 체크 후 받아옴.
    const userId = req.userID;
    const letterId = req.query.letterId;

    if (!userId || !letterId) {
        return res.status(400).json({ ViewLetter: false, message: "userId와 letterId를 모두 제공해야 합니다." });
    }

    try {
        const letter = await Letter.findOne({
            where: {
                id: letterId
            }
        });

        if (!letter) {
            return res.status(404).json({ ViewLetter: false, message: "해당 편지를 찾을 수 없습니다." });
        }

        if (letter.userId !== parseInt(userId, 10)) {
            return res.status(403).json({ ViewLetter: false, message: "해당 편지의 주인이 아닙니다." });
        }

        const currentTime = new Date();

        const finishedAt = new Date(letter.finishedAt);

        if (currentTime > finishedAt) {
            return res.status(200).json({ ViewLetter: true, letter: letter });
        } else {
            return res.status(403).json({ ViewLetter: false, message: "아직 편지를 볼 수 있는 시간이 아닙니다." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ ViewLetter: false, message: "Server Error" });
    }
}

module.exports = viewLetter;
