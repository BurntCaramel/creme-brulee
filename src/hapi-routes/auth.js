const R = require('ramda')
const Boom = require('boom')
const { passwordlessStart, passwordlessVerify } = require('../services/auth0/signIn')
const pickValidations = require('./validations/pick')

module.exports = [
	{
		method: 'POST',
		path: '/1/auth/start',
		config: {
			validate: {
				payload: pickValidations([
					'email'
				])
			}
		},
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
		config: {
			validate: {
				payload: pickValidations([
					'email',
					'code'
				])
			}
		},
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