const R = require('ramda')

const join = ({ separator }) => (
	R.join(separator)
)

module.exports = join