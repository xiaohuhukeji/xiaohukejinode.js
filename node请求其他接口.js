const request = require('request');
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function rlPromisify(fn) {
    return async (...args) => {
        return new Promise(resolve => fn(...args, resolve));
    };
}

const question = rlPromisify(rl.question.bind(rl));
let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function post1() {
    let l = parseInt(new Date / 1e3);
    let gsign1=""// =await getsign1(l)
    console.log(gsign1);
    let pbody = "sub_cmd=1&appid=1088&app_version=1109962501&client_ver=1.0.0&return_page=pages%2Fhome%2Fhome&sdk_ver=1.0.0&ts=" + l + "&gsign=" + gsign1
    const options = {
        url: 'https://minilogin.m.jd.com/cgi-bin/qbapp/qb',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': pbody.length,
            'user-agent': 'Mozilla%2F5.0+%28Linux%3B+Android+12%3B+M2011K2C+Build%2FSKQ1.220303.001%3B+wv%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Version%2F4.0+Chrome%2F103.0.5060.129+Mobile+Safari%2F537.36 QQ/8.9.2.8685 V1_AND_SQ_8.9.2_3072_YYB_D QQ/MiniApp',
            'referer': 'https://appservice.qq.com/1109962501/2.1.1/page-frame.html',
            // 'cookie':'guid=f52b555b95c4c6c62efd7373166270d25830d4f74a7bf89c4c1fbe11e75e6c6e; lsid=2CZtYHqjVaFCOpfndjCke7PsgNVOPMGRqb; pt_key=;'
        },
        body: pbody
    };
    return JSON.parse(await reqpost(options));
}

async function post2(mobile, newgsalt, cookie) {
    let l2 = parseInt(new Date / 1e3);
    let getsign =""//  await getsign2(l2,mobile,newgsalt);
    let gsign2 = getsign.gsign2;
    let sign = getsign.sign;
    let pbody = "country_code=86&mobile=" + mobile + "&sub_cmd=2&sign=" + sign + "&appid=1088&app_version=1109962501&client_ver=1.0.0&return_page=pages%2Fhome%2Fhome&sdk_ver=1.0.0&ts=" + l2 + "&gsign=" + gsign2
    const options = {
        url: 'https://minilogin.m.jd.com/cgi-bin/qbapp/qb',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': pbody.length,
            'user-agent': 'Mozilla%2F5.0+%28Linux%3B+Android+12%3B+M2011K2C+Build%2FSKQ1.220303.001%3B+wv%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Version%2F4.0+Chrome%2F103.0.5060.129+Mobile+Safari%2F537.36 QQ/8.9.2.8685 V1_AND_SQ_8.9.2_3072_YYB_D QQ/MiniApp',
            'referer': 'https://appservice.qq.com/1109962501/2.1.1/page-frame.html',
            'cookie': cookie,
            // "accept-encoding":"gzip"
        },
        body: pbody
    };
    return JSON.parse(await reqpost(options));
}

async function post3(mobile, newgsalt, cookie, smscode) {
    let l3 = parseInt(new Date / 1e3);
    let gsign3 =""//  await getsign3(l3,newgsalt);
    let pbody = "country_code=86&mobile=" + mobile + "&smscode=" + smscode + "&sub_cmd=3&appid=1088&app_version=1109962501&client_ver=1.0.0&return_page=pages%2Fhome%2Fhome&sdk_ver=1.0.0&ts=" + l3 + "&gsign=" + gsign3
    const options = {
        url: 'https://minilogin.m.jd.com/cgi-bin/qbapp/qb',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': pbody.length,
            'user-agent': 'Mozilla%2F5.0+%28Linux%3B+Android+12%3B+M2011K2C+Build%2FSKQ1.220303.001%3B+wv%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Version%2F4.0+Chrome%2F103.0.5060.129+Mobile+Safari%2F537.36 QQ/8.9.2.8685 V1_AND_SQ_8.9.2_3072_YYB_D QQ/MiniApp',
            'referer': 'https://appservice.qq.com/1109962501/2.1.1/page-frame.html',
            'cookie': cookie,
            // "accept-encoding":"gzip"
        },
        body: pbody
    };
    return JSON.parse(await reqpost(options));
}

(async () => {
    let body1 = await post1();
    // console.log(body1);
    let newgsalt = body1.data.gsalt;
    let guid = body1.data.guid;
    let lsid = body1.data.lsid;
    console.log(guid,lsid);
    let cookie = "guid=" + guid + ";lsid=" + lsid + ";pt_key=;"
    // console.log(newgsalt)
    // console.log(cookie)
    // console.log("等待3秒")
    // await wait(3000)
    let phonenum = await question("请输入手机号");
    let body2 = await post2(phonenum, newgsalt, cookie);
    // console.log(body2);
    // //-----------------------------------下面是提交验证码----------------------------------------------------

    let smscode = await question("请输入收到的验证码");
    let body3 = await post3(phonenum, newgsalt, cookie, smscode);
    console.log(body3);
    rl.close();

})()

async function getsign1(l) {
    const options = {
        url: 'http://149.127.232.96:3000/getsign1',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({"ts":l})
    };
    return await reqpost(options);
}
async function getsign2(ts,mobile,newgsalt) {
    const options = {
        url: 'http://149.127.232.96:3000/getsign2',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({"ts":ts,"mobile":mobile,"newgsalt":newgsalt})
    };
    return JSON.parse(await reqpost(options));
}
async function getsign3(ts,newgsalt) {
    const options = {
        url: 'http://149.127.232.96:3000/getsign3',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({"ts":ts,"newgsalt":newgsalt})
    };
    return await reqpost(options);
}

function reqpost(options) {
    return new Promise((resolve, reject) => {
        request.post(options, (error, response, body) => {
            if (error) reject(error);
            // console.log(response.statusCode)
            resolve(body);
        });
    });
}

