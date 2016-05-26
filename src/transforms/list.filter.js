const R = require('ramda')

const filter = ({ where, applyTransforms }) => R.filter(applyTransforms([].concat(where)))

module.exports = filter