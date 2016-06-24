const R = require('ramda')

const preMethods = R.pipe(
	R.toPairs,
	R.map(([assign, resultFromRequest]) => ({
		method(request, reply) {
			reply(resultFromRequest(request))
		},
		assign
	}))
)

module.exports = preMethods
