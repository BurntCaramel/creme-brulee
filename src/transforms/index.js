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
		text: R.map
	},
	object: {
		list: (object) => R.call(R.__, [object])
	}
}

const typeHandler = (actual, expected) => (
	R.pathOr(R.call, [actual, expected], typeHandlerTable) 
)

const transforms = {
	'any.makeObject': require('./any.makeObject'),
	'any.makeList': require('./any.makeList'),
	'object.mapKeys': require('./object.mapKeys'),
	'object.mapValues': require('./mapValues'),
	'object.listValues': require('./object.listValues'),
	//'object.pick': require('./object.pick'),
	'object.propertySatisfies': require('./object.propertySatisfies'),
	'object.merge': require('./object.merge'), 
	'object.mergeAll': () => R.mergeAll, 
	'list.first': require('./list.first'),
	'list.filter': require('./list.filter'),
	'list.map': require('./mapValues'),
	'list.join': require('./list.join'),
	'list.reverse': () => R.reverse,
	'text.uppercase': () => R.toUpper,
	'text.lowercase': () => R.toLower,
	'text.reverse': () => R.reverse,
	'text.beginsWith': require('./text.beginsWith'),
	
	'list.toTable.web': require('./list.toTable.web')
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
		let caller = typeHandler(actualType, expectedType)
		
		//if (actualType === 'list' && expectedType === 'list') {
		if (actualType === 'list') {
			const level = R.propOr(0, 'list.atLevel', transform)
			if (level > 0) {
				// Drill down into nested lists, to apply the transform there
				caller = caller(
					R.apply(R.pipe, R.repeat(R.map, level))
				)
			}
		}
		
		return caller(performRawTransform(transform), acc)
	},
	input,
	[].concat(transforms)
))

baseOptions.applyTransforms = applyTransforms

transforms.applyTransforms = applyTransforms

module.exports = transforms
