const R = require('ramda')

const propertySatisfies = ({ propertyName, transform, applyTransforms }) => (
	R.propSatisfies(applyTransforms(transform), propertyName)
)

module.exports = propertySatisfies