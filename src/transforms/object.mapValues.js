
const R = require('ramda')

const mapValues = R.uncurryN(2, ({ transform, applyTransforms }) => (
	R.map(applyTransforms([].concat(transform)))
))

module.exports = mapValues