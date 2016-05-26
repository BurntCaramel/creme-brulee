const R = require('ramda')

const propertySatisfies = ({ propertyName, transform, applyTransforms }) => (
	R.propSatisfies(applyTransforms([].concat(transform)), propertyName)
)

module.exports = propertySatisfies