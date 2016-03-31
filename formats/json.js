const R = require('ramda')
const isObject = require('lodash/isObject')
const isNumber = require('lodash/isNumber')
const createElement = require('react').createElement
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup

const li = R.partial(createElement, ['li', null])
const dl = R.partial(createElement, ['dl', null])
const dt = R.partial(createElement, ['dt'])
const dd = R.partial(createElement, ['dd'])
const ol = R.partial(createElement, ['ol'])
const code = R.partial(createElement, ['code', null])

/*const renderObjectItem = (key, value) => [
	dt({ key: `key-${key}` }, key),
	dd({ key: `value-${key}`}, renderJSON(value))
]*/

const renderObjectKey = (key, value) => (
	dt({ key: `key-${key}` }, key)
)

const renderObjectValue = (key, value) => (
	dd({ key: `value-${key}`}, renderJSON(value))
)

const renderObjectItem = R.converge(
	(key, value) => [key, value], [
		renderObjectKey,
		renderObjectValue
	]
)

const renderArrayItem = (value) => li(
	renderJSON(value)
)

const renderObject = R.pipe(
	R.toPairs,
	//R.sortBy(R.prop(0)),
	R.map(R.apply(renderObjectItem)),
	R.tap(items => console.log('rendered', items)),
	R.flatten,
	dl
)

const renderArray = R.pipe(
	R.mapObjIndexed(renderArrayItem),
	ol
)

const renderNumber = code

const renderString = R.identity

const renderJSON = R.cond([
	[isObject, renderObject],
	[Array.isArray, renderArray],
	[isNumber, renderNumber],
	[R.T, renderString]
])

const renderJSONError = (error) => createElement('h2', null, 'JSON is invalid ' + error)

const renderRawJSON = R.tryCatch(
	R.pipe(
		JSON.parse,
		renderJSON,
		R.tap(output => console.log(output))
	),
	renderJSONError
)

module.exports = options => input => ({
    innerHTML: renderToStaticMarkup(renderRawJSON(input))
})
