const R = require('ramda')
const escapeRegExp = require('lodash/escapeRegExp')

const passesRegularExpression = require('./text.passesRegularExpression')

const startsWith = R.pipe(
	R.over(
		R.lensProp('value'),
		(text) => (`^${ escapeRegExp(text) }`)
	),
	passesRegularExpression
)

module.exports = startsWith