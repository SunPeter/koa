var app = require("koa")();
var m1 = require("./middlewares/m1");
var m2 = require("./middlewares/m2");
app.use(m1);
app.use(m2);
app.use(function* (next){
	console.log(this.query);
	this.body = "7000";
});

app.listen(7000)
