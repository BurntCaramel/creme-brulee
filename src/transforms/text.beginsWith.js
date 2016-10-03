const R = require('ramda')
const L = require('lodash/fp')

const passesRegularExpression = require('./text.passesRegularExpression')

const startsWith = R.pipe(
	R.over(
		R.lensProp('value'),
		(text) => (`^${ L.escapeRegExp(text) }`)
	),
	passesRegularExpression
)

module.exports = startsWith