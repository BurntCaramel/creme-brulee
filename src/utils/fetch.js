const fetch = require('node-fetch')
const R = require('ramda')
const Boom = require('boom')

const ensureValidStatus = R.tap((apiRes) => {
	const status = apiRes.status 
		
	if (status !== 200) {
		throw Boom.create(status)
	}
})

const fetchValidJSON = R.pipeP(
	fetch,
	ensureValidStatus,
	(apiRes) => apiRes.json()
)

const fetchValidText = R.pipeP(
	fetch,
	ensureValidStatus,
	(apiRes) => apiRes.text()
)

module.exports = {
	fetchValidJSON,
	fetchValidText,
}
