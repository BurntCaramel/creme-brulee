const R = require('ramda')

const insert = ({ item, index = 0, applyTransforms }) => (
	R.insert(index, item)
)

module.exports = insert