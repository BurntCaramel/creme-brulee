const R = require('ramda')

const first = ({ limit = 1 }) => (
	R.take(limit)
)

module.exports = first