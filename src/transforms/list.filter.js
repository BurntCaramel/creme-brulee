const R = require('ramda')

const filter = ({ where, applyTransforms }) => R.filter(applyTransforms(where))

module.exports = filter