var express = require("express");
var app = express();
var mysql = require("mysql");
const request = require("request");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
function rlPromisify(fn) {
  return async (...args) => {
    return new Promise((resolve) => fn(...args, resolve));
  };
}

const question = rlPromisify(rl.question.bind(rl));
let wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
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

var wzrt = [];
var wzrtState = false;

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
  // http://127.0.0.1:3001/login?username=&password=
  // 1.获取表单提交的数据
  let username = req.query.username;
  let password = req.query.password;
  // let sql = "select * from liujiaming where username =? and password=?";
  //查询
  let sql = "select * from user where username =?";
  let params = [username];
  connt.query(sql, params, function (err, rs) {
    if (err) {
      //查询失败
    }
    if (rs.length < 1) {
      //查询成功出来的长度小于1就说明数据库里还没有
      //  res.send("1"); //然后返回一个1给前端
      var sql = "insert into user(id,username,password) values(null,?,?)"; //select * from user where username='15155' and password='151515'
      var params = [username, password];
      connt.query(sql, params, function (err, rs) {
        if (err) {
          //添加失败
        }
        res.send({ code: 200, msg: "注册成功" }); //登录失败
      });
    } else {
      //查询成功出来的长度大于1就说明数据库里面已经有此用户
      res.send({ code: 200, msg: "注册失败,用户已存在" }); //登录失败
      // res.send("0"); //然后返回一个0给前端
    }
  });
});

app.post("/register", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var sql =
    "select * from user where username='" +
    username +
    "' and password='" +
    password +
    "'";
  connt.query(sql, function (err, rs) {
    if (err) {
      //添加失败
    }
    if (rs.length < 1) {
      //查询
      let sql = "select * from user where username =?";
      let params = [username];
      connt.query(sql, params, function (err, rs) {
        if (err) {
          //查询失败
        }
        if (rs.length < 1) {
          res.send({ code: 200, msg: "登录失败,账号未注册", content: "1" }); //登录失败
        } else {
          res.send({
            code: 200,
            msg: "登录失败,登录失败密码错误",
            content: "2",
          }); //登录失败
        }
      });
    } else {
      res.send({ code: 200, msg: "登录成功" }); //登录成功
    }
  });
});
//登录
app.get("/wzry", function (req, res) {
  let query = req.query.name;
  wzrt = [];
  let WZRY1 = disposeWZRY(query, res);
});

async function disposeWZRY(query, res) {
  let WZRY1 = await disposeWZRY1(query);
  let WZRY2 = await disposeWZRY2(query);
  let WZRY3 = await disposeWZRY3(query);
  let WZRY4 = await disposeWZRY4(query);
  let WZRY5 = await disposeWZRY5(query, res);
}
async function disposeWZRY1(query) {
  wzrtState = true;
  let name = encodeURI(query);
  const options = {
    url: "https://jk.cxkf.cc/api_select.php?hero=" + name + "&type=wx",
    headers: {
      "content-type": "application/json",
    },
  };
  return await reqpost(options, "wx");
}

async function disposeWZRY2(query) {
  wzrtState = true;
  let name = encodeURI(query);
  const options = {
    url: "https://jk.cxkf.cc/api_select.php?hero=" + name + "&type=qq",
    headers: {
      "content-type": "application/json",
    },
  };
  return await reqpost(options, "qq");
}
async function disposeWZRY3(query) {
  wzrtState = true;
  let name = encodeURI(query);
  const options = {
    url: "https://jk.cxkf.cc/api_select.php?hero=" + name + "&type=ios_qq",
    headers: {
      "content-type": "application/json",
    },
  };
  return await reqpost(options, "ios_qq");
}
async function disposeWZRY4(query) {
  wzrtState = true;
  let name = encodeURI(query);
  const options = {
    url: "https://jk.cxkf.cc/api_select.php?hero=" + name + "&type=ios_wx",
    headers: {
      "content-type": "application/json",
    },
  };
  return await reqpost(options, "ios_wx");
}

async function disposeWZRY5(query, res) {
  res.send(wzrt);
}

function reqpost(options, name) {
  return new Promise((resolve, reject) => {
    request.post(options, (error, response, body) => {
      if (wzrtState) {
        if (name == "wx") {
          let data = JSON.parse(body).data;
          let wx = {
            name: "wx",
            data: data,
          };
          wzrt.push(wx);
          resolve(wx);
        }
        if (name == "ios_wx") {
          let data = JSON.parse(body).data;
          let ios_wx = {
            name: "ios_wx",
            data: data,
          };
          wzrt.push(ios_wx);
          resolve(ios_wx);
        }
        if (name == "qq") {
          let data = JSON.parse(body).data;
          let qq = {
            name: "qq",
            data: data,
          };
          wzrt.push(qq);
          resolve(qq);
        }
        if (name == "ios_qq") {
          let data = JSON.parse(body).data;
          let ios_qq = {
            name: "ios_qq",
            data: data,
          };
          wzrt.push(ios_qq);
          resolve(ios_qq);
        }
        wzrtState = false;
      }
    });
  });
}

app.listen("3555");
console.log("服务已经开启");
