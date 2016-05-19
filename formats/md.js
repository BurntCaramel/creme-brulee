const R = require('ramda')
const Boom = require('boom')
const renderMarkdown = require('../utils/renderMarkdown')

module.exports = (options) => R.tryCatch(
	renderMarkdown,
	(html) => Object.assign({}, options, {	
		innerHTML: html
	}),
	(error) => {
		console.log('caught', error)
		throw Boom.methodNotAllowed('Item is not valid Markdown')
	}
)
