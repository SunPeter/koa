module.exports = function* (next) {
	this.request.b = 2
	console.log('m2')
	yield next
}
