const R = require('ramda')
const { findInIndexJSONNamed } = require('./findInIndex')

const makeFindInIndexNamed = (promiseItemContent) => (
	R.converge((contentPromise, props) => (
		contentPromise
		.then(JSON.parse)
		.then(R.pipe(
			R.objOf('indexJSON'),
			R.merge(props),
			findInIndexJSONNamed
		))
	), [
		promiseItemContent,
		R.pick(['name', 'organization'])
	])
)

if (process.env.COLLECTED_DATA_SERVICE === 'b2') {
	const findFunctions = require('../b2/find') 
	
	module.exports = R.merge(
		findFunctions, {
			findInIndexNamed: makeFindInIndexNamed(findFunctions.promiseItemContent)
		}
	)
}
else if (process.env.COLLECTED_DATA_SERVICE === 'cloudant') {
	const findFunctions = require('../cloudant/find')
	
	module.exports = R.merge(
		findFunctions, {
			findInIndexNamed: makeFindInIndexNamed(findFunctions.promiseItemContent)
		}
	)
}
else {
	throw `Unknown service ${process.env.COLLECTED_SERVICE}`
}