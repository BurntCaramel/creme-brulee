const R = require('ramda')
const Boom = require('boom')
const { createElement } = require('react')

module.exports = (options) => R.tryCatch(
	R.pipe(
		(input) => (
			R.merge(options, {
				noStyles: true,
				innerHTML: `
<div id="json" style="display: none">${ input }</div>
<div id="app"></div>
`,
				bodyLastElements: [
					`<script src="/1/-web/slides/vendor.js"></script>`,
					`<script src="/1/-web/slides/app.js"></script>`
				]
			})
		)
	),
	(error) => {
		console.log('caught', error)
		throw Boom.notAcceptable('Item is not valid format (expects list of Markdown)')
	}
)
