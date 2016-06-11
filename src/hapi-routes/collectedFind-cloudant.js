const R = require('ramda')
const { findInIndexNamed } = require('../services/cloudant/findInIndex')

const version = '1'

module.exports = [
	{
		// Redirects to item’s URL
		method: 'GET',
		path: `/${version}/find/@{account}/{sha256}/{name*}`,
		handler(request, reply) {
			reply(
				findInIndexNamed(request.params)
			)
			//reply.redirect(`https://royalicing.imgix.net/${version}/@${account}/${sha256}`)
		}
	}
]