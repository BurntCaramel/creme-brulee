
const R = require('ramda')

const merge = R.uncurryN(2, ({ object }) => (
	R.merge(object)
))

module.exports = merge