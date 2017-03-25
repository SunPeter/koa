module.exports = function* (next) {
	console.log("m2");
	yield next;
	console.log("m2 finish");
	yield next;
}
