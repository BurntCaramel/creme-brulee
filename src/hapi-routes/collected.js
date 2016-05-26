const { findItemInfo, promiseStreamOfItemContent } = require('../sections/cloudant/find')
const { publishItem } = require('../sections/cloudant/publish')
const { deleteItem } = require('../sections/cloudant/delete')

const itemPath = '/1/@{organization}/{sha256}'

module.exports = [
	{
		// Whether version 1 of the API is available
		method: 'GET',
		path: '/1',
		handler(request, reply) {
			reply({ available: true })
			//reply({ available: true, credentials: request.auth.credentials.sub })
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
					reply(stream)
						.type(request.headers['accept'])
						//.etag(request.params.sha256)
				},
				(error) => reply(error)
			)
		}
	},
	{
		method: 'PUT',
		path: itemPath,
		config: {
			auth: 'token',
			payload: {
				output: 'stream',
				parse: false,
				defaultContentType: 'application/octet-stream'
			}
		},
		handler(request, reply) {
			reply(
				publishItem({
					organization: request.params.organization,
					sha256: request.params.sha256,
					contentStream: request.payload
				})
			)
		}
	},
	{
		method: 'DELETE',
		path: itemPath,
		config: { auth: 'token' },
		handler(request, reply) {
			reply(
				deleteItem(request.params)
			)
		}
	}
]