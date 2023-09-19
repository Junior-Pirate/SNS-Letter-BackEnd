const express = require('express');
const router = express.Router();

const letterCreate = require("./letter/create/letterCreate.js")
const letterBoxCreate = require("./letter/letterbox/letterBoxCreate.js")
const letterList = require("./letter/list/letterList.js")
const letterView = require("./letter/view/letterView.js")
const {auth} = require('./Middleware/auth.js');

router.post('/create',letterCreate);
router.get('/letterbox',auth,letterBoxCreate);
router.get('/list',letterList);
router.get('/view',auth,letterView);

module.exports = router