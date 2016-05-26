const URL = require('url')
const Boom = require('boom')
const api = require('./api')
const throwWhenNil = require('../../utils/throwWhenNil')

const authorizationHeader = {
	'Authorization': `Bearer ${process.env.AUTH0_USERS_TOKEN}`
}

const findUserWithEmail = (email) => (
	api.get('/api/v2/users', {
		params: {
			search_engine: 'v2',
			email
		},
		headers: authorizationHeader
	})
)
.then(R.prop(0))

module.exports = {
	findUserWithEmail
}
