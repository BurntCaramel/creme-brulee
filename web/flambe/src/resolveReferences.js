import R from 'ramda'

const resolveReference = (source) => R.pipe(
	R.propEq('id'),
	R.find(R.__, source),
	R.unless(
		R.isNil,
		R.prop('content')
	)
) 

const resolveReferences = R.pipe(
	resolveReference, // pass source
	R.map
)

export default resolveReferences
