import R from 'ramda'

const rejectEmptyStrings = R.filter(R.test(/\S/))

const parseElement = R.converge(
	(text, tags, references) => ({ text, tags, references, children: [] }),
	[
		R.pipe(
			R.replace(/[#@]\w*(:\s*\S*)?/g, ''), // remove tags
			R.replace(/\s+/g, ' '), // clean up spaces
			R.trim
		),
		R.pipe(
			R.match(/#(\w+)(:(\s*\S*))?/g), // match tags,
			R.map(R.pipe(
				R.match(/#(\w+)(:\s*(\S*))?/), // match tags,
				R.props([1, 3]),
				R.adjust(R.defaultTo(true), 1)
			)),
			R.fromPairs
		),
		R.pipe(
			R.match(/@(\w+)/g), // match references
			R.map(R.tail),
			rejectEmptyStrings
		)
	]
)

const addChildTo = R.curry((element, parent) => (
	R.mergeWith(R.concat, parent, {
		children: [element]
	})
))

export const parseInput = R.pipe(
	R.split('\n\n'), // sections
	R.map(R.pipe(
		R.split('\n'), // elements
		rejectEmptyStrings, // must have content
		R.reduce((items, itemInput) => {
			const [ prefix, body ] = R.tail(R.match(/^(-)?\s*(.*)$/, itemInput)) // just get captured
			if (body == null) {
				return items
			}

			const element = parseElement(body)
			const isChild = R.equals('-', prefix)
			console.log('isChild', isChild, body)
			if (isChild) {
				return R.adjust(addChildTo(element), -1, items)
			}
			else {
				return R.concat(items, element)
			}
		}, [])
	)),
	R.reject(R.isEmpty)
)