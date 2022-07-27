const http = require('http')
const url = require('url')
const querystring = require('querystring')
const fs = require('fs')
let user = {
	admin: 123456
}
http.createServer((req, res) => {
	let path, get, post
	console.log("req.method " + req.method);
	if (req.method == 'GET') {
		let { pathname, query } = url.parse(req.url, true)
		path = pathname;
		get = query;
		console.log("pathname, query=" + pathname, query)
		complete()
	} else
		if (req.method == 'POST') {
			let arr = []
			path = req.url;
			req.on('data', buffer => {
				arr.push(buffer)
			})
			req.on('end', () => {
				let post = querystring.parse(Buffer.concat(arr).toString());
				console.log(post)
				complete(post)
			})
		}


	function complete(post) {
		console.log('path=' + path)
		if (path === '/login') {
			let { username, password } = get
			//乱码问题
			res.writeHead(200, {
				"Content-Type": "text/plain;charset=utf-8"
			})
			console.log(username, password)
			if (!user[username]) {
				res.end(JSON.stringify({
					err: 1,
					msg: "no exist"
				}))
			} else if (user[username] != password) {
				res.end(JSON.stringify({
					err: 1,
					msg: "error password中文"
				}))
			} else {
				res.end(JSON.stringify({
					err: 0,
					msg: "succeed"
				}))
			}
		}
		else if (path === '/reg') {
			res.writeHead(200, {
				"Content-Type": "text/plain;charset=utf-8"
			})
			console.log(post);
			let { username, password } = post
			if (user[username]) {
				res.end(JSON.stringify({
					err: 1,
					msg: "账户 exist"
				}))
			} else {
				user[username] = password
				res.end(JSON.stringify({
					err: 0,
					msg: "注册成功"
				}))
			}
		}
		else {
			fs.readFile(`./${req.url}`, (err, data) => {
				if (err) {
					res.writeHead(404)
					res.end('404 not found')
				} else {
					res.end(data)
				}
			})
		}
	}
}
).listen(8898)
