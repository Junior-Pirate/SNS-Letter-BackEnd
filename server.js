const express = require('express');
const app = express();

const port = 9000;

const register = require("./router/register/register.js")
const login = require("./router/login/login.js")

app.get('/',(req,res)=>{
    res.send("main")
})

app.use('/register',register)
app.use('/login',login)

app.listen(port, () => {
    console.log('App listening on port ' + port);
});
