var app = require("koa")()


function* middleware1(next) {

    console.log("middleware1 start")

    yield next

    console.log("middleware1 end")

}

function* middleware2(next) {

    console.log("middleware2 start")

    yield middleware2Sub.call(this, next)

    console.log("middleware2 end")


}

function* middleware2Sub(next) {
    console.log("middleware2Sub start")

    yield next

    console.log("middleware2Sub end")
}

function* all(next) {
    yield middleware1.call(this, middleware2.call(this, next))
}

app.use(all)

app.listen(8080)