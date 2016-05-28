const R = require('ramda')
const specialTypes = require('./specialTypes')

const createElement = R.curry((type, props) => (
	Object.assign({ type }, R.when(
		R.anyPass([R.is(String), R.is(Array)]),
		R.objOf('children'),
		props
	))
))

const toWebTable = (options) => (list) => {
	console.log('list', list)
	
	const allKeys = R.keys(R.reduce(
		R.merge,
		{},
		list
	))
	
	console.log('allKeys', allKeys)
	
	return {
		type: specialTypes.react,
		element: createElement('table', {
			children: [
				createElement('thead', {
					children: createElement('tr', {
						children: R.map(
							createElement('th'),
							allKeys
						)
					})
				}),
				createElement('tbody', {
					children: R.map(
						(item) => createElement('tr', {
							children: R.map(
								createElement('td'),
								R.props(allKeys, item)
							)
						}),
						list
					)
				})
			]
		})
}
}

module.exports = toWebTable