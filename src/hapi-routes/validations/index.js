const Joi = require('joi')

const stringRequired = Joi.string().required() 
const emailRequired = Joi.string().email().required()

const rev = Joi.string().regex(/^[\d]+[-][0-9a-f]+$/).required()

const organizationName = Joi.string().token().required()
const sha256 = Joi.string().hex().required()

const tag = Joi.string().alphanum().required()
const tags = Joi.array().items(tag).required()

const transforms = Joi.array().items(
	Joi.object({
		type: stringRequired,
		transforms: Joi.lazy(() => transforms).description('Transforms schema')
	}).unknown()
).single()

module.exports = {
	organizationName,
	sha256,
	email: emailRequired,
	ownerEmail: emailRequired,
	transforms,
	code: stringRequired,
	tag,
	tags,
	rev
}