const R = require('ramda')
const { promiseItemContent, promiseStreamOfItemContent, findInIndexNamed } = require('../services/collected/find')
const replyPipe = require('./pre/replyPipe')

const v = '1'

module.exports = [
	{
		// Whether version 1 of the API is available
		method: 'GET',
		path: `/${v}`,
		handler(request, reply) {
			reply({ available: true })
		}
	},
	{
		method: 'GET',
		path: `/${v}/@{organization}/{sha256}`,
		config: {
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler(request, reply) {
			// Unwrap promise to the underlying stream
			promiseItemContent(request.params).then(
			//promiseStreamOfItemContent(request.params).then(
				(stream) => {
					reply(stream)
						.type(request.headers['accept'])
						//.etag(request.params.sha256)
				},
				(error) => {
					console.error(error)
					reply(error)
				}
			)
		}
	},
	{
		// Return SHA256 of item in collected index
		method: 'GET',
		path: `/${v}/find/@{account}/{sha256}/{name*}`,
		handler: replyPipe(
			R.prop('params'),
			findInIndexNamed
		)
		/*handler(request, reply) {
			reply(
				findInIndexNamed(request.params)
			)
		}*/
	}
]