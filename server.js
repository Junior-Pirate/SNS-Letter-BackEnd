const express = require('express');
const app = express();

const port = 9000;

const register = require("./router/register/register.js")
const login = require("./router/login/login.js")
const search = require("./router/search/search.js")

app.get('/',(req,res)=>{
    res.send("main")
})

app.use('/register',register)
app.use('/login',login)
app.use('/search',search)

app.listen(port, () => {
    console.log('App listening on port ' + port);
});
