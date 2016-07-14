const R = require('ramda')

const placeholderBases = [
	'!'
]

const isPlaceholder = R.allPass([
	Array.isArray,
	//R.propIs(String, 0),
	R.propSatisfies(R.contains(R.__, placeholderBases), 0)
])

const placeholderToKey = R.join(':')

const replacePlaceholders = R.uncurryN(2, (placeholdersToReplacements) => (
	R.cond([
		[
			isPlaceholder,
			R.pipe(
				placeholderToKey,
				R.prop(R.__, placeholdersToReplacements)
			)
		],
		[
			R.is(Object),
			R.map(replacePlaceholders(placeholdersToReplacements))
		],
		[
			Array.isArray,
			R.map(replacePlaceholders(placeholdersToReplacements))
		],
		[
			R.T,
			R.identity
		]
	])
))

const fillPlaceholdersHandler = R.pipe(
	R.converge(replacePlaceholders, [
		R.pipe(
			R.prop('placeholdersToReplacements'),
			R.map(R.pipe(
				R.props(['placeholder', 'replacement']),
				R.adjust(placeholderToKey, 0)
			)),
			R.fromPairs
		),
		R.prop('template'),
	]),
	(result) => Promise.resolve(result)
)

module.exports = fillPlaceholdersHandler
