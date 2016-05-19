const { findItemInfo, promiseStreamOfItemContent } = require('../sections/cloudant/find')
const { publishItem } = require('../sections/cloudant/publish')
const { deleteItem } = require('../sections/cloudant/delete')

const itemPath = '/1/@{account}/{sha256}'

module.exports = [
	{
		// Whether version 1 of the API is available
		method: 'GET',
		path: '/1',
		//config: { auth: 'token' },
		handler(request, reply) {
			reply({ available: true })
		}
	},
	{
		method: 'GET',
		path: itemPath,
		config: {
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler(request, reply) {
			// Unwrap promise to the underlying stream
			promiseStreamOfItemContent(request.params).then(
				(stream) => {
					reply(result)
						.type(request.headers['accept'])
						//.etag(request.params.sha256)
				},
				(error) => reply(error)
			)
		}
	},
	{
		method: 'POST',
		path: itemPath,
		config: {
			payload: {
				output: 'stream',
				parse: false,
				defaultContentType: 'application/octet-stream'
			}
		},
		handler(request, reply) {
			reply(
				publishItem({
					account: request.params.account,
					sha256: request.params.sha256,
					contentStream: request.payload
				})
			)
		}
	},
	{
		method: 'DELETE',
		path: itemPath,
		handler(request, reply) {
			reply(
				deleteItem(request.params)
			)
		}
	}
]