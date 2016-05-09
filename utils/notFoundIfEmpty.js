const R = require('ramda')
const Boom = require('boom')

const notFoundIfEmpty = R.when(
	R.isNil,
	() => { throw Boom.notFound() }
)

module.exports = notFoundIfEmpty