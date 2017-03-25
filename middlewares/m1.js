module.exports = function* (next) {
	console.log("m1");
	yield next;  //yield next;的作用就是我们之前提到过的delegating yield的功能
	console.log("m1 finish");
	yield next;
}
