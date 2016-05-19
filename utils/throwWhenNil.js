const R = require('ramda')

const throwWhenNil = (error) => R.when(
	R.isNil,
	() => { throw error }
)

module.exports = throwWhenNil