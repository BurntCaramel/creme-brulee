const R = require('ramda')
const URL = require('url')
const CSV = require('csv')
const nodePromise = require('../utils/nodePromise')
const { promiseItemContent, promiseStreamOfItemContent } = require('../sections/cloudant/find')
//const { findInIndexNamed } = require('../sections/cloudant/findInIndex')
const rendererForFormat = require('../formats').rendererForFormat
const { applyTransforms } = require('../transforms')

const version = '1'

module.exports = [
	{
		method: 'POST',
		path: `/${version}/transform/csv/@{account}/{sha256}`,
		handler(request, reply) {
			reply(
				promiseItemContent(request.params)
				.then((data) => nodePromise((callback) => {
					CSV.parse(data, {
						columns: true
					}, callback)
				}))
				.then(
					applyTransforms(request.payload.transforms)
				)
				.catch((error) => {
					console.error(error)
				})
			)
		}
	}
]