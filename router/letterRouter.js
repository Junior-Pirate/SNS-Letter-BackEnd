const express = require('express');
const router = express.Router();

const letterCreate = require("./letter/create/letterCreate.js")
const letterBoxCreate = require("./letter/letterbox/letterBoxCreate.js")
const {auth} = require('./Middleware/auth.js');

router.post('/create',letterCreate);
router.get('/letterbox',auth,letterBoxCreate);

module.exports = router