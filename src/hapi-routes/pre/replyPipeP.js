const R = require('ramda')

module.exports = (...functions) => R.curry((request, reply) => {
	reply(
		R.pipeP(...functions)(request)
	)
})