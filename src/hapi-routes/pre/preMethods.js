const R = require('ramda')

const preMethods = R.pipe(
	R.toPairs,
	R.map(([assign, method]) => ({
		method: R.unless(
			R.is(String),
			(resultFromRequest) => (request, reply) => {
				reply(resultFromRequest(request))
			}
		)(method),
		assign
	}))
)

module.exports = preMethods
