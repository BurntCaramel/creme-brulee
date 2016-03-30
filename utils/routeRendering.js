const defaultTemplate = require('../templates/default')

function renderResponse(promise, res) {
	promise
		.then(defaultTemplate)
		.then(
			output => {
				res.send(output)
			},
			error => {
				res.status(error.status || 500)
				res.send({ error: error.message, stack: error.stack })
			}
		)
}

const routeRendering = (renderRequest) => (req, res) => renderResponse(renderRequest(req), res)

module.exports = routeRendering
