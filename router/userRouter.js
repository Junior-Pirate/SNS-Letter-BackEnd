const express = require('express');
const router = express.Router();

const userRegister = require("./user/register/register.js")
const userLogin = require("./user/login/login.js")
const userLogout = require("./user/logout/logout.js")
const userCheck = require("./user/refresh.js")

router.post('/register',userRegister.register)

router.post('/login',userLogin.login)

router.post('/logout',userLogout.logout)

router.get('/refresh',userCheck.verifyAccessTokenReissue)


module.exports = router