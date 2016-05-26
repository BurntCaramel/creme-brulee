const R = require('ramda')
const Boom = require('boom')
const { passwordlessStart, passwordlessVerify } = require('../sections/auth0/signIn')

module.exports = [
	{
		method: 'POST',
		path: '/1/auth/start',
		handler(request, reply) {
			reply(
				passwordlessStart(
					R.pick(['email'], request.payload)
				)
			)
		}
	},
	{
		method: 'POST',
		path: '/1/auth/verify',
		handler(request, reply) {
			reply(
				passwordlessVerify(
					R.pick(['email', 'code'], request.payload)
				)
				/*.then(R.pipe(
					R.pick(['id_token', 'access_token'])
				))*/
			)
		}
	}
]