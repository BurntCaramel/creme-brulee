
const R = require('ramda')

const listValues = R.uncurryN(2, ({ keys }) => (
	R.props(keys)
))

module.exports = listValues