const express = require('express');
const router = express.Router();
const bp = require("body-parser");
const cors = require("cors");
const db = require("../../db/auth.js")

router.use(bp.json());
router.use(cors());

module.exports = router