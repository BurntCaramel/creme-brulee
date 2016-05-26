const R = require('ramda')

const propIfElse = (name, yes, no) => R.ifElse(
	R.propEq(name, true),
	R.always(yes),
	R.always(no)
) 

const regExpFlagsForOptions = R.converge(R.unapply(R.join('')), [
	propIfElse('caseSensitive', '', 'i'),
	propIfElse('multipleLines', 'm', '')
])

const passesRegularExpression = R.pipe(
	R.converge((pattern, flags) => (
		new RegExp(pattern, flags)
	), [
		R.prop('value'),
		regExpFlagsForOptions
	]),
	R.test
)

module.exports = passesRegularExpression