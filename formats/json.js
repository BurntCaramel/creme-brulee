const R = require('ramda')
const isObject = require('lodash/isObject')
const isNumber = require('lodash/isNumber')
const createElement = require('react').createElement
const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup

const li = R.partial(createElement, ['li', null])
const dl = R.partial(createElement, ['dl', null])
const dtAttrs = R.partial(createElement, ['dt'])
const ddAttrs = R.partial(createElement, ['dd'])
const ol = R.partial(createElement, ['ol', null])
const code = R.partial(createElement, ['code', null])
const p = R.partial(createElement, ['p', null])

const renderObjectItem = (key, value) => [
	dtAttrs({ key: `key-${key}` }, key),
	ddAttrs({ key: `value-${key}`}, renderJSON(value))
]

const renderObjectKey = (key, value) => (
	dtAttrs({ key: `key-${key}` }, key)
)

const renderObjectValue = (key, value) => (
	ddAttrs({ key: `value-${key}`}, renderJSON(value))
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
	R.map(renderArrayItem),
	ol
)

const renderNumber = code

const renderString = p

const renderJSON = R.cond([
	[Array.isArray, renderArray],
	[isObject, renderObject],
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

const JSONFormatter = R.pipe(
	R.prop('json'),
	renderRawJSON
)

module.exports = options => input => ({
    innerHTML: renderToStaticMarkup(createElement(JSONFormatter, { json: input }))
})
