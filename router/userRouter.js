const express = require('express');
const router = express.Router();

const userRegister = require("./user/register/register.js")
const userLogin = require("./user/login/login.js")
const userLogout = require("./user/logout/logout.js")
const userCheck = require("./user/check.js")

router.post('/register',userRegister.register)

router.post('/login',userLogin.login)

router.use('/logout',userLogout.logout)

router.use('/check',userCheck.check)


module.exports = router