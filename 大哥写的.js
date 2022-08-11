var express = require("express");
const request = require("request");

var app = express();
const port = 3555;

//导入body-parser
const bodyparser = require("body-parser");
//解析表单数据
app.use(bodyparser.urlencoded({ extended: false }));
//解析json数据
//具体可以去body-parser的官方文档去看
app.use(bodyparser.json());

//node 跨域处理
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  //
  next();
});

let wzrt = [];
let querying = false;

app.get("/wzry", function (req, res) {
  if (querying) {
    res.send("你的操作过于繁忙");
    return false;
  }
  querying = true;
  const query = req.query.name;
  disposeWZRY(query, res);
});

const BASEURL = "https://jk.cxkf.cc/api_select.php";

async function disposeWZRY(query, res) {
  const name = encodeURI(query);
  const types = ["wx", "qq", "ios_qq", "ios_wx"];
  const headers = {
    "content-type": "application/json",
  };
  const optionsList = types.map((type) => {
    return {
      name,
      url: `${BASEURL}?hero=${name}&type=${type}`,
      headers,
    };
  });
  const taskList = optionsList.map((option) => {
    return () => reqpost(option, option.name);
  });
  wzrt = []; // reset
  // await serialExecute(taskList);
  await concurrentExecute(taskList);
  querying = false;
  res.send(wzrt);
}

function reqpost(options, name) {
  return new Promise((resolve, reject) => {
    request.post(options, (error, response, body) => {
      console.log(error);
      let data = [];
      if (body) {
        data = JSON.parse(body).data;
      }
      let wx = {
        name,
        data: data,
      };
      wzrt.push(wx);
      resolve(wx);
    });
  });
}

app.listen(port, () => {
  console.log("服务已经开启");
  getNetworkIp().forEach((ip) => {
    console.log(`http://${ip}:${port}/wzry/?name=test`);
  });
});

// 辅助函数

const serialExecute = async (tasks = []) => {
  const resultList = [];
  for (task of tasks) {
    try {
      resultList.push(await task());
    } catch (e) {
      resultList.push(null);
    }
  }
  return resultList;
};

const concurrentExecute = async (tasks = []) => {
  const resultList = await Promise.all(tasks.map((task) => task()));
  return resultList;
};

const os = require("os");
function getNetworkIp() {
  let hosts = []; // 打开的host
  try {
    // 获得网络接口列表
    let network = os.networkInterfaces();
    for (let dev in network) {
      let iface = network[dev];
      for (let i = 0; i < iface.length; i++) {
        let alias = iface[i];
        if (alias.family == "IPv4") {
          hosts.push(alias.address);
        }
      }
    }
  } catch (e) {
    hosts.push("localhost");
  }
  return hosts;
}
