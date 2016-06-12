const { publishItem } = require('../services/b2/publish')
//const { deleteItem } = require('../services/b2/delete')

const itemPath = '/1/@{organization}/{sha256}'

module.exports = [
	{
		method: 'PUT',
		path: itemPath,
		config: {
			auth: 'token',
			payload: {
				parse: false,
				defaultContentType: 'application/octet-stream'
			}
		},
		handler(request, reply) {
			reply(
				publishItem({
					organization: request.params.organization,
					sha256: request.params.sha256,
					contentBuffer: request.payload
				})
				.catch(error => {
					console.error(error)
					throw error
				})
			)
		}
	}/*,
	{
		method: 'DELETE',
		path: itemPath,
		config: {
			auth: 'token'
		},
		handler(request, reply) {
			reply(
				deleteItem(request.params)
			)
		}
	}*/
]