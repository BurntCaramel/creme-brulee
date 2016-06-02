const R = require('ramda')
const Boom = require('boom')
const { promiseItemContent } = require('./find')
const throwWhenNil = require('../../utils/throwWhenNil')

 const findInIndexNamed = R.converge((indexPromise, name, organization) => (
	 indexPromise
	.then(R.tryCatch(
		JSON.parse,
		() => { throw Boom.badData('Invalid collected index JSON') }
	))
	.then(R.pipe(
		R.prop('items'),
		throwWhenNil(Boom.badData(`Invalid collected index: expected key 'items'`)),
		R.find(R.propEq('name', name)),
		throwWhenNil(Boom.notFound(`Item with name '${name}' was not found in index`)),
		R.prop('sha256'),
		R.objOf('sha256'),
		R.merge({ organization })
	))
 ), [
	promiseItemContent,
	R.prop('name'),
	R.prop('organization')
])

module.exports = {
	findInIndexNamed
}
