const landing = require('../sections/landing')
const hapiTemplateHandler = require('../utils/hapiTemplateHandler')

module.exports = [
	{
		method: 'GET',
		path: '/',
		handler: hapiTemplateHandler(landing.renderHomePageRequest)
	}
]