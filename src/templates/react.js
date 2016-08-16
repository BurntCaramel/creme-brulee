const { renderToString, renderToStaticMarkup } = require('react-dom/server')

const renderTemplate = require('./default')

module.exports = (options) => {
	const {
		element,
		dynamic = false
	} = options

	return renderTemplate(R.merge(rest, {
		innerHTML: (dynamic ? renderToString : renderToStaticMarkup)(element)
	}))
}
