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
var appid = "wx98831d7cee9dc881",secret = "34c487c0f12bdf000fab9f836215ada6",url="http://ssd3237649.xicp.net/",token="weixintoken";

app.use(_static('./public'));

app.use(handlebars({
    viewsDir: "views"
}));
app.use(router.routes()).use(router.allowedMethods());

router.get('/index', function *(next) {
    var data =yield sign();
    yield this.render("index", data);
}).get('/',function* (next){
    var qs =querystring.parse(this.request.querystring);
    qs.token =token;
    var signature =qs.signature;
    var echostr =qs.echostr;
    delete qs.signature;
    delete qs.echostr;
    var keys =Object.keys(qs).sort();
    var _qs ="";
    for(var i =0 ;i <keys.length;i++){
        _qs+=qs[keys[i]];
    }
    var _signature =getsignature(_qs);
    this.body=echostr;
    
}).post('/',function* (next){
    console.log(this.request);
    this.body ="haha";
})

function getsignature(qs){
    var shasum = crypto.createHash('sha1');
    shasum.update(qs);

    var signature = shasum.digest('hex');
    return signature;
}
function* sign() {
    var options = {
        url: 'https://api.weixin.qq.com/cgi-bin/token',
        qs: {
            grant_type: "client_credential",
            appid: appid,
            secret: secret
        }
    };

    var response = yield request(options); //Yay, HTTP requests with no callbacks! 
    var info = JSON.parse(response.body);
    var token = info.access_token;
    var options = {
        url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
        qs: {
            access_token: token,
            type: "jsapi"
        }
    };

    var response = yield request(options); //Yay, HTTP requests with no callbacks! 
    var info = JSON.parse(response.body);
    var ticket = info.ticket;

    var auth = {
        jsapi_ticket: ticket,
        noncestr: Math.random().toString(36).substr(2, 15),
        timestamp: parseInt(new Date().getTime() / 1000) + '',
        url: url
    }
    var temp = [];
    for (var item in auth) {
        var s = item + "=" + auth[item];
        temp.push(s);
    }

    var authString = temp.join("&");
    var shasum = crypto.createHash('sha1');
    shasum.update(authString);

    var signature = shasum.digest('hex');
    return {
        appid :appid,
        signature: signature,
        auth: auth
    }
}
var ip=os.networkInterfaces().en0[1].address;

app.listen(8080,function(){
    console.log("server is listening "+ip+":8080");
})