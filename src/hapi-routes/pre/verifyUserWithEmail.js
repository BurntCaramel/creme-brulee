const { findUserWithName } = require('../../sections/auth0/users')

const defaultCreateError = (error) => Boom.notFound(`User with email ${email} not found`)

const verifyUserWithEmail = (createError = defaultCreateError) => (request, reply) => {
	const { email } = request.params
	
	reply(
		findUserWithName(email)
		.then(
			throwWhenNil(createError(email))
		)
	)
}

module.exports = verifyUserWithEmail