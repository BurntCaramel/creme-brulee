const landing = require('./landing')
const benefits = require('./benefits')
const features = require('./features')
const hapiTemplateHandler = require('../../utils/hapiTemplateHandler')

exports.routes = [
	{
		method: 'GET',
		path: '/',
		handler: hapiTemplateHandler(landing.renderRequest)
	},
	{
		method: 'GET',
		path: '/benefits',
		handler: hapiTemplateHandler(benefits.main)
	},
	{
		// Recipes, micro-content, organisational tools, sections
		method: 'GET',
		path: '/features',
		handler: hapiTemplateHandler(features.main)
	}
]