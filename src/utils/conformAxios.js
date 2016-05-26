const R = require('ramda')
const Boom = require('boom')
const conformPromiseError = require('./conformPromiseError') 

const onSuccess = R.ifElse(
	R.propSatisfies((status) => (status >= 400), 'status'),
	(response) => Promise.reject(Boom.create(response.status)),
	R.prop('data')
)

const conformAxios = (promise) => conformPromiseError(promise.then(onSuccess))

module.exports = conformAxios