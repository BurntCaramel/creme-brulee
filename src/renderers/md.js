const R = require('ramda')
const Boom = require('boom')
const renderMarkdown = require('../utils/renderMarkdown')

module.exports = (options) => R.tryCatch(
	R.pipe(
		renderMarkdown,
		(html) => R.merge(options, {	
			innerHTML: html
		})
	),
	(error) => {
		console.log('caught', error)
		throw Boom.notAcceptable('Item is not valid Markdown')
	}
)
