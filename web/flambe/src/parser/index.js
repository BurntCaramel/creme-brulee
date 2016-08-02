import R from 'ramda'

const tagsRegex = /\B#\w+(:\s*\S*)?/g
const rejectEmptyStrings = R.filter(R.test(/\S/))

const parseText = R.pipe(
	R.replace(/\B[#@]\w*(:\s*\S*)?/g, ''), // remove tags and mentions
	//R.replace(/([#@]\w*(:\s*\S*)\s?)+\s*$/, ''), // remove tags and mentions
	R.replace(/\s+/g, ' '), // clean up spaces
	R.trim
)

const parseMentions = R.pipe(
	R.match(/@(\w+)/g), // match references
	R.map(R.tail),
	rejectEmptyStrings
)

const parseTagContent = R.converge(
	(text, references) => ({ text, references }),
	[
		parseText,
		parseMentions
	]
)

const parseTags = R.pipe(
	R.match(tagsRegex), // match tags,
	R.map(R.pipe(
		R.match(/\B#(\w+)(:\s*(\S*))?/), // capture tag elements,
		R.props([1, 3]),
		R.adjust(
			R.pipe(
				R.when(
					R.is(String),
					parseTagContent
				),
				R.defaultTo(true)
			),
			1
		),
	)),
	R.fromPairs
)

const parseElement = R.converge(
	(text, tags, references) => ({ text, tags, references, children: [] }),
	[
		parseText,
		parseTags,
		R.pipe(
			R.replace(tagsRegex, ''),
			parseMentions
		)
	]
)


const addChildTo = R.curry((element, parent) => (
	R.mergeWith(R.concat, parent, {
		children: [element]
	})
))

const prefixAndBodyRegex = /^([0-9]?[-0-9.]*[-.])?\s*(.*)$/
const orderedPrefixRegex = /^[0-9]/

export const parseInput = R.pipe(
	R.split('\n\n'), // sections
	R.map(R.pipe(
		R.split('\n'), // elements
		rejectEmptyStrings, // must have content
		R.reduce((items, itemInput) => {
			const [ prefix, body ] = R.tail(R.match(prefixAndBodyRegex, itemInput)) // just get captured
			if (body == null) {
				return items
			}

			const element = parseElement(body)
			const isChild = prefix != null
			if (isChild) {
				if (items.length === 0) {
					const ordered = R.test(orderedPrefixRegex, prefix)
					return [
						{
							text: null,
							tags: { list: true, ordered },
							references: [],
							children: [element]
						}
					]
				}
				else {
					return R.adjust(addChildTo(element), -1, items)
				}
			}
			else {
				return R.concat(items, element)
			}
		}, [])
	)),
	R.reject(R.isEmpty)
)