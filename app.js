var koa = require("koa");
var handlebars = require("koa-handlebars");
var request = require('koa-request');
var querystring = require("querystring");
var crypto = require('crypto');
var app = koa();
var appid = "wx57943ffa33b29537",secret = "c9720551b51463ecee299b9007e7bb7b",url="http://ssd3237649.xicp.net/";
app.use(handlebars({
    viewsDir: "views"
}));

app.use(function*() {
    if (this.path == "/login") {
        var siteUrl = querystring.escape(url);
        var redirectUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + siteUrl + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
        this.redirect(redirectUrl);
        return;
    }
    var code =this.request.query.code;
    var options={
        url: "https://api.weixin.qq.com/sns/oauth2/access_token",
        qs: {
            grant_type: "authorization_code",
            appid: appid,
            code:code,
            secret: secret
        }
    }

    var response = yield request(options); //Yay, HTTP requests with no callbacks! 
    var info = JSON.parse(response.body);
    var token = info.access_token;
    var openId =info.openid;
    var options = {
        url: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
        qs: {
            access_token: token,
            type: "jsapi"
        }
    };

    var options={
        url:"https://api.weixin.qq.com/sns/userinfo",
        qs:{
            access_token:token,
            openid:openId,
            lang:"zh_CN"
        }
    }
    var response = yield request(options); //Yay, HTTP requests with no callbacks! 
    var info = JSON.parse(response.body);
    yield this.render("index", info);
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
        auth: auth,
        url: url
    }
}
app.listen(8080)