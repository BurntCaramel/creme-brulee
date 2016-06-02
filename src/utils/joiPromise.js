const Joi = require('joi')

module.exports = (schema) => (value) => (
	Promise.resolve(value)
	.then(value => Joi.assert(
		value,
		Joi.compile(schema)
	))
)
