import R from 'ramda'

export const parseInput = R.pipe(
	R.split('\n\n'), // sections
	R.map(R.pipe(
		R.split('\n'), // elements
		R.filter(R.test(/\S/)), // must have content
		R.map(R.converge(
			(name, tags) => ({ name, tags }),
			[
				R.pipe(
					R.replace(/#\w*/g, ''), // remove tags
					R.replace(/\s+/g, ' '), // clean up spaces
					R.trim
				),
				R.match(/#\w+/g) // match tags
			]
		))
	)),
	R.reject(R.isEmpty)
)