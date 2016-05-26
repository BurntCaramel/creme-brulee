const R = require('ramda')

const validations = require('./index')

module.exports = R.pick(R.__, validations)
