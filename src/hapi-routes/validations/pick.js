const R = require('ramda')
const Joi = require('joi')

const validations = require('./index')

module.exports = R.pipe(
	R.pick(R.__, validations),
	Joi.compile
)
