const defaultTemplate = require('../templates/default')

const hapiTemplateHandler = (renderRequest) => (request, reply) => reply(
	Promise.resolve(renderRequest(request))
		.then(defaultTemplate)
)

module.exports = hapiTemplateHandler
