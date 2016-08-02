import R from 'ramda'

const transformRawContentCatching = (transform) => R.tryCatch(
	R.pipe(
		R.prop('rawContent'),
		transform,
		R.objOf('content'),
		R.merge({ error: null })
	),
	R.objOf('error')
)

export default R.converge(R.call, [
	R.unary(R.merge),
	R.cond([
		[
			R.propEq('type', 'json'),
			transformRawContentCatching(JSON.parse)
		],
		[
			R.propEq('type', 'text'),
			transformRawContentCatching(R.identity)
		],
		[
			R.T,
			transformRawContentCatching(R.identity)
		]
	])
])
