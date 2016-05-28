const R = require('ramda')
const escape = require('lodash/escape')
const { createElement } = require('react')
const { renderToStaticMarkup } = require('react-dom/server')

const jsonRenderer = require('./json')
const plainRenderer = require('./plain')
const specialTypes = require('../transforms/specialTypes')

let createElementTap = (type, props) => {
	console.log('create element', type, props)
	return createElement(type, props)
}

const convertObjectToReact = R.converge((type, props, children) => (
	createElementTap(type, R.merge(props, {
		children: R.map(R.ifElse(
			R.is(String),
			R.identity,
			convertObjectToReact
		), children)
	}))
), [
	R.prop('type'),
	R.omit(['type', 'children']),
	R.pipe(
		R.prop('children'),
		R.defaultTo([]),
		R.concat([]) // Always an array
	)
])

const autoFormat = R.ifElse(
	R.is(String),
	plainRenderer({}),
	R.ifElse(
		R.anyPass([R.is(Array), R.is(Object)]),
		R.cond([
			[
				R.propEq('type', specialTypes.react),
				R.pipe(
					R.prop('element'),
					R.tap(output => console.dir(output, { depth: null })),
					convertObjectToReact,
					R.tap(output => console.log('react element', output)),
					renderToStaticMarkup,
					R.objOf('innerHTML')
				)
			],
			[ R.T, jsonRenderer({ isDeserialized: true }) ]
		]),
		plainRenderer({}) 
	)
) 

module.exports = (options) => autoFormat
