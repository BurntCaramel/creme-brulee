const Joi = require('joi')

const stringRequired = Joi.string().required() 
const emailRequired = Joi.string().email().required()

module.exports = {
	organizationName: Joi.string().token().required(),
	email: emailRequired,
	ownerEmail: emailRequired,
	transforms: Joi.array().items(Joi.object({
		type: emailRequired
	}).unknown()).single(),
	code: stringRequired
}