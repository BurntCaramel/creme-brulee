import R from 'ramda'

const rejectEmptyStrings = R.filter(R.test(/\S/))

export const parseInput = R.pipe(
	R.split('\n\n'), // sections
	R.map(R.pipe(
		R.split('\n'), // elements
		rejectEmptyStrings, // must have content
		R.map(R.pipe(
			R.split('|'),
			rejectEmptyStrings, // must have content
			R.map(R.converge(
				(name, tags, references) => ({ name, tags, references }),
				[
					R.pipe(
						R.replace(/[#@]\w*/g, ''), // remove tags
						R.replace(/\s+/g, ' '), // clean up spaces
						R.trim
					),
					R.match(/#\w+/g), // match tags,
					R.match(/@\w+/g) // match references
				]
			))
		))
	)),
	R.reject(R.isEmpty)
)