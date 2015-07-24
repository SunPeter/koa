var koa = require('koa');
var session=require('koa-session')
var app = koa();

app.keys=["secret"]

app.use(session(app));

var num;
app.use(function*() {
	num=this.session.view||0
	this.session.view=++num
    this.body="view time:"+num
    console.log(this.session)

});




app.listen(8080)