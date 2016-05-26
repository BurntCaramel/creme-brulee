
const R = require('ramda')

const mapValues = R.uncurryN(2, ({ transform, applyTransforms }) => (
	R.map(applyTransforms(transform))
))

module.exports = mapValues