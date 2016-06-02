const landing = require('../services/landing')
const hapiTemplateHandler = require('../utils/hapiTemplateHandler')

module.exports = [
	{
		method: 'GET',
		path: '/',
		handler: hapiTemplateHandler(landing.renderHomePageRequest)
	}
]