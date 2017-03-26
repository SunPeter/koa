'use strict'
let MIDDLEWIRES = './middleware'
let PAGE = './page'
let fs = require('fs')
let path = require('path')
let Koa = require('koa')
let glob = require('glob')
let compose = require("koa-compose")
let render = require('./lib/render')
let app = Koa()
app.use(require('koa-trie-router')(app))
readMiddleware(app)
readPage(app)
app.listen(8080)

function readMiddleware(app) {
	let dir = fs.readdirSync(path.join(__dirname, MIDDLEWIRES))
	dir.forEach(name => {
		let file = path.join(__dirname, MIDDLEWIRES, name)
		app.use(require(file))
	})
}

function readPage(app) {
	let dirs = glob.sync(path.join(__dirname, PAGE, '/**/'))
	dirs = dirs.filter(datum => {
		let relative = path.relative(path.join(__dirname, PAGE), datum)
		return relative
	})
	let pages = dirs.map(dir => {
		let page = {}
		let dirName = path.relative(path.join(__dirname, PAGE), dir)
		let controller = path.join(dir, 'index.js'), tpl = path.join(dir, `${dirName}.hbs`)
		if (fs.existsSync(controller)) {
			page.name = dirName
			if (fs.existsSync(tpl)) {
				page.tpl = tpl
			}
			controller = require(controller)
			if (!Array.isArray(controller)) {
				controller = [controller]
			}
			controller.forEach((datum,i) => {
				if (!page.data) page.data = []
				page.data.push({
					controller: datum.controller,
					url: datum.url,
					method: datum.method || 'get'
				})
			})
			return page
		}
	})
	console.log(pages);
	pages.forEach(page => {
		let data = page.data
		data.forEach(datum => {
			let responseController = routeController(page, datum)
			app[datum.method](datum.url, responseController)
		})
	})

	function routeController(page, datum) {
		return function* (next) {
			let res = yield datum.controller()
			if (res) {
				let html = render(fs.readFileSync(page.tpl, 'utf8'), res)
				this.body = html
			}
		}
	}
}
