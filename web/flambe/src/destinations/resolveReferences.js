import R from 'ramda'

const resolveReference = (source) => R.converge(
	R.call, [
		R.pipe(
			R.tail,
			R.concat(['content']),
			R.path
		),
		R.pipe(
			R.head,
			R.propEq('id'),
			R.find(R.__, source),
		)
]) 

const resolveReferences = R.pipe(
	resolveReference, // pass source
	R.map
)

export default resolveReferences
