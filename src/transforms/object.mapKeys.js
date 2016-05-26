const R = require('ramda')

const valueForGetterIn = (input) => R.cond([
	[ R.is(String), R.prop(R.__, input) ],
	[ R.is(Function), R.call(R.__, input) ]
])

const mapKeys = R.curry(({ newToOldKeys }, input) => {
	const valueForGetter = valueForGetterIn(input)
	
	return R.reduce(
		(combined, [newKey, getter]) => {
			combined[newKey] = valueForGetter(getter)
			return combined
		},
		{},
		R.toPairs(newToOldKeys)
	)
})

module.exports = mapKeys