var express = require('express')
var fs = require("fs")
var app = express()
app.use(express.static("www"))
app.use(express.urlencoded({extended:false}))
// 先获取user.json里面的数据和req.body进行对比
fs.readFile("./user.json",function(err,data){
    if (err) {
        userArr = []
    }else{
        userArr = JSON.parse(data)
    }
})
app.post("/zhuce",function(req,res,next){
    // 输入框要验证的数据判断机制：
    // 可以把正则表达式判断放在前端：用户体验好，判断快
    // 也可以把正则表达式判断放在后端：判断相对安全，判断慢
    // console.log(req.body);
    var u = req.body.v1
    var p = req.body.v2
    var isZhuce = userArr.some(function(v,i,a){
        return v.user === u
    })
    if (isZhuce) {
        res.json({
            code:201,
            shibai:"该账号已注册"
        })
    }else{
        userArr.push({user:`${req.body.v1}`,psw:`${req.body.v2}`})
        fs.writeFile("./user.json",JSON.stringify(userArr),function(){
            res.json({
                code:200,
                chenggong:"index2.html"
            }) 
        })
    }
 
})
 
app.post("/denglu",function(req,res,next){
    var deng = userArr.findIndex(function(v,i,a){
            return v.user === req.body.v1
    })
    console.log(deng);
    if (deng != -1) {
        if (userArr[deng].psw === req.body.v2) {
            res.json({
                code:251,
                mima:"登录成功"
            })
        }else{
            res.json({
                code:252,
                mima:"密码错误"
            })
        }
    }else{
        res.json({
            code:250,
            mima:"该账号未注册"
        })
    }
})
 
 
 
app.listen(3000,function(){
    console.log("run");
})