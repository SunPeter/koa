module.exports = function* (next) {
	this.request.a = 1
	console.log('m1')
	yield next
}
