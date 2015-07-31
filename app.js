var os = require("os");
var querystring = require("querystring");
var koa = require("koa");
var handlebars = require("koa-handlebars");
var request = require('koa-request');
var querystring = require("querystring");
var crypto = require('crypto');
var xml2js = require("xml2js");
var xmlParseString =xml2js.parseString;
var app = koa();
var _static = require('koa-static');
var router = require('koa-router')();
var buddy = require("koa-buddy");
var appid = "wx98831d7cee9dc881",secret = "34c487c0f12bdf000fab9f836215ada6",url="http://ssd3237649.xicp.net/",token="weixintoken";

app.use(_static('./public'));

app.use(handlebars({
    viewsDir: "views"
}));
app.use(buddy()).use(router.routes()).use(router.allowedMethods());

router.get('/index', function *(next) {
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
    var access_token = info.access_token;

    var options = {
        url: 'https://api.weixin.qq.com/cgi-bin/material/batchget_material',
        qs: {
            "access_token":access_token,
            "type":"news",
            "offset":0,
            "count":5
        }
    };
    var response = yield request(options); //Yay, HTTP requests with no callbacks! 
    var info = JSON.parse(response.body);
    console.log(info);
    this.set("Content-Type","application/xml");
    this.body = "<xml><ToUserName><![CDATA[toUser]]></ToUserName><FromUserName><![CDATA[fromUser]]></FromUserName><CreateTime>12345678</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[你好]]></Content></xml>"
    // var data =yield sign();
    // yield this.render("index", data);
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
    var msg = this.request.body;
    var that = this;
    var data = xmlParseString(msg,function(err,data){
        if(!err){
            var to =data.xml.ToUserName[0],
                from = data.xml.FromUserName[0],
                content = data.xml.Content[0];
            var time =parseInt(Date.now() / 1000)+"";
            that.set("Content-Type","application/xml");
            that.body ="<xml><FromUserName><![CDATA["+to+"]]></FromUserName><ToUserName><![CDATA["+from+"]]></ToUserName><CreateTime>"+time+"</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA["+content+"]]></Content><MsgId>6177496640807477410</MsgId></xml>"
        }
    });
    
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