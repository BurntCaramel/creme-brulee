const { findItemInfo, findItemContent } = require('../sections/cloudant/find')
const { publishItem } = require('../sections/cloudant/publish')
const { deleteItem } = require('../sections/cloudant/delete')

const itemPath = '/1/@{account}/{sha256}'

module.exports = [
	{
		method: 'GET',
		path: itemPath,
		config: {
			cache: {
				privacy: 'public',
				expiresIn: 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler(request, reply) {
			// Can promise a stream, so unwrap promise
			findItemContent(request.params).then(
				(result) => (
					reply(result)
						.type(request.headers['accept'])
						//.etag(request.params.sha256)
				),
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