
const R = require('ramda')

const makeObject = R.curry(({ key }, input) => (
	R.objOf(key, input)
))

module.exports = makeObject