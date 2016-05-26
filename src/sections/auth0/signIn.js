const R = require('ramda')
const Boom = require('boom')
const api = require('./api')
const conformAxios = require('../../utils/conformAxios')

const passwordlessStart = ({ email }) => conformAxios(
	api.post('/passwordless/start', {
		client_id: process.env.AUTH0_CLIENT_ID,
		connection: 'email',
		email,
		send: 'code'
	})
)

const passwordlessVerify = ({ email, code }) => conformAxios(
	api.post('/oauth/ro', {
		client_id: process.env.AUTH0_CLIENT_ID,
		connection: 'email',
		scope: 'openid',
		grant_type: 'password',
		username: email,
		password: code
	})
)

module.exports = {
	passwordlessStart,
	passwordlessVerify
}
