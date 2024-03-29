const R = require('ramda')

module.exports = (...functions) => R.curry((request, reply) => {
	reply(
		//R.apply(R.pipe, functions)(request)
		R.pipe(...functions)(request)
	)
})