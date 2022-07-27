var express = require('express')
var path = require("path");
var mysql = require('mysql')
var router = express.Router()
 
var connection = mysql.createConnection({
     host: "43.138.152.216",
  user: "342414384",
  password: "xiaohu",
  database: "jdtest",
})
connection.connect()

/**
*登录验证功能
*/
router.get('/login',function(req,res){
    var username = req.query.username
    var password = req.query.password
    var query1 = "select * from login where username='"+username+"' and password='"+password+"'"
    connection.query(query1,function(err,result){
        if (err) throw err;
        console.log("!!!",result)
        if(result.length==0){
            res.send("用户名或密码错误")
        }else{res.send("<h2>登录成功，欢迎<h2>")}
    })
})
/***
 * 注册功能
 */
router.get('/register',function(req,res){
    res.end(err);
    return
    var username = req.query.username
    var password = req.query.password
    var user = [username,password];
    var query1 = 'insert into login(username,password) values(?,?)';
    connection.query(query1,user,function(err,result){
    if(err) throw err;
    })
})
module.exports = router;