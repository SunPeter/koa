var koa = require('koa');

var app = koa();

app.keys=["secret","keys"]

var num;
app.use(function*() {
	num=this.cookies.get("view")||0
	num++
    this.cookies.set("view",num,{
    	signed: true
    })
    this.body="view time:"+num

});




app.listen(8080)