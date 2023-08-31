const express = require('express');
const router = express.Router();

const letterCreate = require("./letter/create/letterCreate.js")
const authMiddleware = require('./Middleware/auth.js');

router.post('/create', authMiddleware.auth, letterCreate);

module.exports = router