var querystring = require("querystring")
var app = require("koa")()
var parse = require("co-body")

app.use(function* response() {
	console.log(this.method)
    if (this.method == "POST") {
        var body = yield parse(this)
        console.log(body)
    }
})

app.listen(8080)