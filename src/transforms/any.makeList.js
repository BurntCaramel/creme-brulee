
const R = require('ramda')

const makeList = R.curry(({}, input) => (
	[input]
))

module.exports = makeList