const R = require('ramda')
const escape = require('lodash/escape')

module.exports = (options) => (input) => (
	R.merge(options, {	
		innerHTML: escape(input)
	}) 
)