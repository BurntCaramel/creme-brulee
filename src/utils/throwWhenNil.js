const R = require('ramda')

const throwWhenNil = R.uncurryN(2, (error) => R.when(
	R.isNil,
	() => { throw error }
))

module.exports = throwWhenNil