const R = require('ramda')
const Boom = require('boom')
const { createElement } = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const RoyalPiping = require('royal-piping')

module.exports = (options) => (content) => (
	R.merge(options, {
		innerHTML: renderToStaticMarkup(
			createElement(
				RoyalPiping,
				{ content: [].concat(content) }
			)
		)
	})
)
