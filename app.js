var koa = require("koa");
var handlebars = require("koa-handlebars");
var request = require('koa-request');
var querystring = require("querystring");
var crypto = require('crypto');
var app = koa();
var appid = "wx98831d7cee9dc881",secret = "34c487c0f12bdf000fab9f836215ada6",url="http://ssd3237649.xicp.net/";
app.use(handlebars({
    viewsDir: "views"
}));

app.use(function*() {
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
    var data = sign(ticket,url);
    yield this.render("index", data);
});

function sign(ticket,url) {

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
app.listen(8080)