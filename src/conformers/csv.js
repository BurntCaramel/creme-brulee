const R = require('ramda')
const Boom = require('boom')
const CSV = require('csv')
const nodePromise = require('../utils/nodePromise')

const conformCSV = R.curry((options, data) => (
	nodePromise((callback) => {
		CSV.parse(data, {
			columns: true
		}, callback)
	})
	.catch((error) => Promise.reject(
		Boom.notAcceptable('Item is not valid CSV')
	))
))

module.exports = conformCSV
