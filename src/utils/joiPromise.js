const R = require('ramda')
const Joi = require('joi')

module.exports = (schema) => (value) => (
	Promise.resolve(value)
	.then(R.tap((value) => Joi.assert(
		value,
		Joi.compile(schema)
	)))
)
