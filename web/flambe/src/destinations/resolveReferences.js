import R from 'ramda'

const resolveReference = R.curry((variationIndexes, source) => R.converge(
	R.call, [
		R.converge(R.pipe(
			R.concat,
			R.path
		), [
			R.pipe(
				R.head, // The ingredient id
				R.prop(R.__, variationIndexes),
				R.defaultTo(0),
				R.concat(['variations']),
				R.append('content')
				// Becomes ['variations', $, 'content'']
			),
			R.tail  // Rest is the path
		]),
		R.pipe(
			R.head, // First is the ingredient id
			R.propEq('id'),
			R.find(R.__, source),
		)
]))

const resolveReferences = (variationIndexes) => R.pipe(
	resolveReference(variationIndexes), // pass source
	R.map
)

export default resolveReferences
