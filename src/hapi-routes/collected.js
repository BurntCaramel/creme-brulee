const { findItemInfo, promiseStreamOfItemContent } = require('../services/cloudant/find')

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
	}
]