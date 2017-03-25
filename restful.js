var os = require("os");
var querystring = require("querystring");
var koa = require("koa");
var handlebars = require("koa-handlebars");
var request = require('koa-request');
var querystring = require("querystring");
var crypto = require('crypto');
var app = koa();
var _static = require('koa-static');
var router = require('koa-router')();

app.use(_static('./public'));

app.use(handlebars({
    viewsDir: "views"
}));
app.use(router.routes()).use(router.allowedMethods());

router.get('/json', function *(next) {
    var _this = this;
    res = {
        foo: "foo",
        bar: "bar"
    }
    var a;
    console.log(a.name);
    _this.body = res;
}).get('/error', function *(next) {
    throw 42;
    this.response.status = 500;
}).post('/json', function *(next) {
    this.body = {
        foo: "foo",
        bar: "bar"
    }
});

var ip=os.networkInterfaces().en0[1].address;
app.on("error", function(err){
    console.log(err);
});
app.listen(8080,function(){
    console.log("server is listening "+ip+":8080");
})
