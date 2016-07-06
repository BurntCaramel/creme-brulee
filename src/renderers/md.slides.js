const R = require('ramda')
const Boom = require('boom')

const slidesRenderer = require('./slides')

module.exports = (options) => R.tryCatch(
	R.pipe(
		R.split('\n#'),
		R.converge(R.concat, [
			R.pipe(
				R.head,
				R.of
			),
			R.pipe(
				R.tail,
				R.map(R.concat('#'))
			)
		]),
		R.objOf('slides'),
		JSON.stringify,
		slidesRenderer(options)
	),
	(error) => {
		console.log('caught', error)
		throw Boom.notAcceptable('Item is not valid Markdown')
	}
)
