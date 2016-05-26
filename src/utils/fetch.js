const fetch = require('node-fetch')
const R = require('ramda')

const createError = require('./createError')

const ensureValidStatus = R.tap((apiRes) => {
	const status = apiRes.status 
		
	if (status !== 200) {
		throw createError(apiRes.statusText, { status })
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
