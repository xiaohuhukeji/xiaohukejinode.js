var express = require("express");
var app = express();
var mysql = require("mysql");
//导入body-parser
const bodyparser = require("body-parser");
//解析表单数据
app.use(bodyparser.urlencoded({ extended: false }));
//解析json数据
//具体可以去body-parser的官方文档去看
app.use(bodyparser.json());

var connt = mysql.createConnection({
  host: "43.138.152.216", //ip地址
  user: "342414384", //数据库登录用户
  password: "xiaohu", //登录密码
  port: "3306", //端口号
  database: "jdtest", //需要连接的数据库
});
connt.connect();

//node 跨域处理
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == "options")
    res.send(200); //让options尝试请求快速结束
  else next();
});

//登录
app.get("/login", function (req, res) {
  // http://127.0.0.1:3001/login?uname=&pwd=
  // 1.获取表单提交的数据
  let uname = req.query.uname;
  let pwd = req.query.pwd;
  // let sql = "select * from liujiaming where uname =? and pwd=?";
  //查询
  let sql = "select * from user where username =?";
  let params = [uname];
  connt.query(sql, params, function (err, rs) {
    if (err) {
      //查询失败
      console.log(err);
    }
    console.log(rs); //打印查询成功
    if (rs.length < 1) {
      //查询成功出来的长度小于1就说明数据库里还没有
      res.send("1"); //然后返回一个1给前端
      var sql = "insert into user(id,username,password) values(null,?,?)"; //select * from user where username='15155' and password='151515'
      var params = [uname, pwd];
      connt.query(sql, params, function (err, rs) {
        if (err) {
          //添加失败
          console.log(err);
        }
        res.send({code: 200,msg:'注册成功'});//登录失败
        console.log(rs); //打印添加成功
      });
    } else {
      //查询成功出来的长度大于1就说明数据库里面已经有此用户
      res.send({code: 200,msg:'注册失败'});//登录失败
      // res.send("0"); //然后返回一个0给前端
    }
  });
});

app.post("/logins", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var sql = "select * from user where username='"+username+"' and password='"+password+"'";
  connt.query(sql, function (err, rs) {
    if (err) {
      //添加失败
      console.log(err);
    }
    if (rs.length < 1){
      res.send({code: 200,msg:'登录失败'});//登录失败
    }else{
      
      res.send({code: 200,msg:'登录成功'}); //登录成功
    }
   // console.log(rs); //打印添加成功
  });
});

app.listen("3555");
console.log("服务已经开启");
