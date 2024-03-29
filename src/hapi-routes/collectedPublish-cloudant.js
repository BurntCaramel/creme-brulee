const { publishItem } = require('../services/cloudant/publish')
const { deleteItem } = require('../services/cloudant/delete')

const itemPath = '/1/@{organization}/{sha256}'

module.exports = [
	{
		method: 'PUT',
		path: itemPath,
		config: {
			auth: 'auth0token',
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
		config: {
			auth: 'auth0token'
		},
		handler(request, reply) {
			reply(
				deleteItem(request.params)
			)
		}
	}
]