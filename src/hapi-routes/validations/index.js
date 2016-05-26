const Joi = require('joi')

const email = Joi.string().email().required()

module.exports = {
	organizationName: Joi.string().token().required(),
	email,
	ownerEmail: email
}