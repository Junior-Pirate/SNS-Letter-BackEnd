const express = require('express');
const app = express();
const session = require('express-session');

const port = 9000;

const register = require("./router/register/register.js")
const login = require("./router/login/login.js")
const search = require("./router/search/search.js")
const kakao_login = require("./router/kakao/kakao")

app.use(session({
    secret:'ras',
    resave:true,
    secure:false,
    saveUninitialized:false,
}))

app.use('/register',register)
app.use('/login',login)
app.use('/search',search)
app.use('/kakao',kakao_login)

//세션을 활용해서 카카오에서 던져주는 token을 저장

app.get('/',(req,res)=>{
    res.send("main")
})

app.listen(port, () => {
    console.log('App listening on port ' + port);
});
