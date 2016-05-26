const R = require('ramda')
const Boom = require('boom')
const throwWhenNil = require('../utils/throwWhenNil')

const typeOf = R.cond([
	[ R.is(String), R.always('text') ],
	[ R.is(Array), R.always('list') ],
	[ R.T, R.always('object') ]
])

const typeHandlerTable = {
	list: {
		object: R.map,
		string: R.map
	},
	object: {
		list: (object) => R.call(R.__, [object])
	}
}

const typeHandler = (actual, expected) => (
	R.pathOr(R.call, [actual, expected], typeHandlerTable) 
)

const transforms = {
	'object.mapKeys': require('./object.mapKeys'),
	'object.mapValues': require('./mapValues'),
	'object.propertySatisfies': require('./object.propertySatisfies'),
	'list.first': require('./list.first'),
	'list.filter': require('./list.filter'),
	'list.map': require('./mapValues'),
	'list.reverse': () => R.reverse,
	'text.uppercase': () => R.toUpper,
	'text.lowercase': () => R.toLower,
	'text.reverse': () => R.reverse,
	'text.beginsWith': require('./text.beginsWith')
}

const transformWithID = R.converge(throwWhenNil, [
	(id) => Boom.methodNotAllowed(`Transform '${id}' not recognised`),
	R.prop(R.__, transforms)
])

const baseOptions = {}

const performRawTransform = R.converge(R.call, [
	R.pipe(
		R.prop('type'),
		transformWithID
	),
	(options) => R.merge(baseOptions, options)
])

const applyTransforms = R.curry((transforms, input) => R.reduce(
	(acc, transform) => {
		const actualType = typeOf(acc)
		const expectedType = transform.type.split('.')[0]
		const caller = typeHandler(actualType, expectedType)
		return caller(performRawTransform(transform), acc)
	},
	input,
	[].concat(transforms)
))

baseOptions.applyTransforms = applyTransforms

transforms.applyTransforms = applyTransforms

module.exports = transforms
