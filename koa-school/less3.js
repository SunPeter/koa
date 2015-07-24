var app=require("koa")()
var fs=require("fs")

app.use(function* res() {
	if("/echo"==this.path){
		this.body="echo!"
	}
	else if("/res"==this.path){
		this.body=fs.createReadStream("./less2.js")
	}
})

app.listen(8080)