var app = require("koa")()


app.use(function* middleware1(next) {

    console.log("middleware1 start")

    yield next

    console.log("middleware1 end")

})

app.use(function* middleware2(next) {

    console.log("middleware2 start")

    yield middleware2Sub.call(this, next)

    console.log("middleware2 end")


})

function* middleware2Sub(next) {
    console.log("middleware2Sub start")

    yield next

    console.log("middleware2Sub end")
}


app.use(middleware3("name:peter"))

function middleware3(params) {
    return function*(next) {
        console.log("middleware3 and params is:" + params)
    }
}

app.listen(8080)