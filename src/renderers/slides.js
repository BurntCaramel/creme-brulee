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
				headElements: [
					`<link href="https://fonts.googleapis.com/css?family=Lobster+Two:400,700" rel="stylesheet" type="text/css">`,
					`<link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300,700" rel="stylesheet" type="text/css">`,
					`<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/prism/1.3.0/themes/prism-tomorrow.css">`
				],
				bodyLastElements: [
					`<script src="https://cdn.jsdelivr.net/prism/1.3.0/prism.js" type="text/javascript"></script>`,
					`<script src="https://cdn.jsdelivr.net/prism/1.3.0/components/prism-jsx.min.js" type="text/javascript"></script>`,
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
