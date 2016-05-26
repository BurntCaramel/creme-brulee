const R = require('ramda')
const Boom = require('boom')

const createErrorWithStatus = (status, messageForStatus) => (
	Boom.create(status, messageForStatus ? messageForStatus(status) : undefined)
)

const onFailure = (messageForStatus) => R.pipe(
	R.when(
		R.has('status'),
		(error) => createErrorWithStatus(error.status, messageForStatus)
	),
	R.when(
		R.has('statusCode'),
		(error) => createErrorWithStatus(error.statusCode, messageForStatus)
	),
	(error) => Promise.reject(error)
)

const conformPromiseError = (promise, messageForStatus) => promise.catch(onFailure(messageForStatus))

module.exports = conformPromiseError