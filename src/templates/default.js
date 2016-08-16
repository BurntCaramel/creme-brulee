const R = require('ramda')
const escape = require('lodash/escape')

const renderStyles = require('./renderStyles')

const renderMeta = (name, content) => (
	`<meta name="${ name }" content="${ escape(content) }">`
)

const renderMetas = R.pipe(
	R.reject(R.isNil),
	R.toPairs,
	R.map(R.apply(renderMeta)),
	R.join('\n')
)

const renderElements = R.pipe(
	R.defaultTo([]),
	R.join('\n')
)

const renderGoogleAnalyticsScript = (id = 'UA-12168665-5') => (
`<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', '${ id }', 'auto');
  ga('send', 'pageview');

</script>
`)

module.exports = ({
	title,
	originalSourceURL,
	noStyles = false,
	theme,
	headElements,
	bodyFirstElements,
	innerHTML,
	bodyLastElements
}) => (
`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${ escape(title) }</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
${
	renderMetas({
		'original-source': originalSourceURL
	})
}
${ noStyles ? '' : (
	`<style>${ renderStyles(theme) }</style>`
) }
${
	renderElements(headElements)
}
<meta name="google-site-verification" content="BeUEBVIu8Wzed4DOo9b7b9cPZODQ6bmelwNbsGbZyj0" />
</head>
<body>
${
	renderGoogleAnalyticsScript()
}
${
	renderElements(bodyFirstElements)
}
<article>
${
	innerHTML
}
</article>
${
	renderElements(bodyLastElements)
}
</body>
</html>
`)