var koa = require('koa');
var views = require('co-views')

var render = views(__dirname + "/views", {
    ext: "ejs"
})

var app = koa();
console.log(__dirname)
var user = {
    name: {
        first: 'Tobi',
        last: 'Holowaychuk'
    },
    species: 'ferret',
    age: 3
};



app.use(function*() {
    var tmpl = yield render("tmpl", {"user":user})
    this.body = tmpl

});




app.listen(8080)