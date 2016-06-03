const R = require('ramda')

module.exports = (...functions) => (request, reply) => {
	reply(
		//R.apply(R.pipe, functions)(request)
		R.pipe(...functions)(request)
	)
}