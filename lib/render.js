let hogan = require('hogan')
function render(tpl, data) {
	let template = hogan.compile(tpl);
	return template.render(data)
}
module.exports = render
