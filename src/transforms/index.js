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
	'object.mapValues': require('./object.mapValues'),
	'object.propertySatisfies': require('./object.propertySatisfies'),
	'list.first': require('./list.first'),
	'list.filter': require('./list.filter'),
	'text.uppercase': () => R.toUpper,
	'text.lowercase': () => R.toLower,
	'text.beginsWith': require('./text.beginsWith')
}

const transformWithID = R.converge(throwWhenNil, [
	(id) => Boom.methodNotAllowed(`Transform '${id}' not recognised`),
	R.prop(R.__, transforms)
])

const baseOptions = {}

const performTransform = R.converge(R.call, [
	R.pipe(
		R.prop('type'),
		transformWithID
	),
	(options) => R.merge(baseOptions, options)
])

const applyTransforms = R.flip(R.reduce(
	(acc, transform) => {
		const actualType = typeOf(acc)
		const expectedType = transform.type.split('.')[0]
		console.log('actualType', actualType, 'expectedType', expectedType)
		const caller = typeHandler(actualType, expectedType)
		//return caller(transformWithID(transform.type)(transform), acc)
		return caller(performTransform(transform), acc)
	}
))

baseOptions.performTransform = performTransform
baseOptions.applyTransforms = applyTransforms

transforms.applyTransforms = applyTransforms

module.exports = transforms
