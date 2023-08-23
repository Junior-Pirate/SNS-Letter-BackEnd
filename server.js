const express = require('express');
const cors = require("cors");
const app = express();

var corOptions = {
    origin: "https://localhost:9000",
};

app.set("port", process.env.PORT || 9000);

app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("./models/index");


const userRouter = require("./router/userRouter.js")
const kakao_login = require("./router/kakao/kakao")
const letter = require("./router/letter/letter.js")

app.use("/user",userRouter)
app.use('/kakao',kakao_login)

//세션을 활용해서 카카오에서 던져주는 token을 저장

app.get('/',(req,res)=>{
    res.send("main")
})

app.listen(app.get("port"), () => {
    console.log('App listening on port ' + app.get("port"));
});
