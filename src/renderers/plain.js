const R = require('ramda')
const L = require('lodash/fp')

module.exports = (options) => (input) => (
	R.merge(options, {	
		innerHTML: L.escape(input)
	}) 
)