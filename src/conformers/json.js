const R = require('ramda')
const Boom = require('boom')

const conformJSON = R.curry((options, data) => (
	Promise.resolve(data)
	.then((data) => JSON.parse(data)) // Capture JSON errors 
	.catch((error) => Promise.reject(
		Boom.notAcceptable('Item is not valid JSON')
	))
))

module.exports = conformJSON
