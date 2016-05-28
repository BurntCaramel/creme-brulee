
const R = require('ramda')

const pick = R.uncurryN(2, ({ keys }) => (
	R.pick(keys)
))

module.exports = pick