const R = require('ramda')
const Boom = require('boom')
const throwWhenNil = require('../../utils/throwWhenNil')

const findInIndexJSONNamed = ({ indexJSON, name, organization }) => (
	R.pipe(
		R.prop('items'),
		throwWhenNil(Boom.badData(`Invalid collected index: expected key 'items'`)),
		R.find(R.propEq('name', name)),
		throwWhenNil(Boom.notFound(`Item with name '${name}' was not found in index`)),
		R.pick(['sha256']),
		R.merge({ organization })
	)(indexJSON)
)

module.exports = {
	findInIndexJSONNamed
}
