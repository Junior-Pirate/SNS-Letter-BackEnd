const express = require('express');
const router = express.Router();
const bp = require("body-parser");
const cors = require("cors");

router.use(bp.json());
router.use(cors());

module.exports = router