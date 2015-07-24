var querystring=require("querystring")
var koa = require("koa")
var app = koa()

app.use(function*(next) {
    console.log("method:" + this.method)
    console.log("query:" + querystring.stringify(this.query))
    console.log("host:" + this.host)
    yield next
})

app.use(function*(next) {
    if (this.path !== "/") {
        return yield next
    }
    this.body = "hello koa1"
})

app.use(function*(next) {
    if (this.path !== "/404") {
        return yield next
    }
    this.body = "page not found"
})

app.use(function*(next) {
    if (this.path !== "/500") {
        return yield next
    }
    this.body = "internal server error"
})



app.listen(8080)



// Also there are some router middlewares for koa, you can find them in npm:

//   * koa-route
//   * koa-router
//   * koa-resource-router