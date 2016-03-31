const R = require('ramda')

function renderStyles(darkMode) { 
	const lightColor = '#fcfcfc'
	const darkColor = '#0a0a0a'

	const measure = 30
	const baseFontSize = 18
	const baseLineHeight = 1.333333333
	const fontFamilyStack = 'system, "-apple-system", "-webkit-system-font", BlinkMacSystemFont, "Helvetica Neue", "Helvetica", "Segoe UI", "Roboto", "Arial", "freesans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
	const backgroundColor = darkMode ? '#1b1b1b' : '#fbfbfb'
	const color = darkMode ? '#fafafa' : '#0a0a0a'
	//const linkColor = '#3999e7'
	const linkColor = '#eb1a4e'
	//const baselineGridRule = 'background-image: repeating-linear-gradient(to bottom, transparent 0px, transparent 1.29rem, red 1.29em, red 1.333333333rem);' 
	const baselineGridRule = ''
	
	const selectors = {
		bodyButton: 'p > a:only-child',
		navButton: 'nav > a'
	}

	function typeBaselineGrid(fontSize, lineHeightFactor) {
		const lineHeight = baseLineHeight * lineHeightFactor;
		return `
		position: relative;
		font-size: ${fontSize}rem;
		line-height: ${lineHeight}rem;
		top: ${ lineHeight - fontSize }rem;
		`
	}

	return `html {
		font-size: ${baseFontSize}px;
		font-size: calc(112.5% + 2 * (100vw - 600px) / 400);
		background-color: ${backgroundColor};
		color: ${color};
	}

	body {
		box-sizing: border-box;
		max-width: 100vw;
		margin: auto;
		padding: ${baseLineHeight}rem 1.7em;
		line-height: ${baseLineHeight}rem;
		font-family: ${fontFamilyStack};
		${baselineGridRule}
	}

	a {
		color: ${linkColor};
		text-decoration: none;
	}
	${selectors.navButton} {
		display: inline-block;
		padding: ${baseLineHeight * 0.5}rem 0.875em;
		background-color: ${linkColor};
		color: white;
	}

	h1, h2, h3, p, ul, ol, pre {
		${ typeBaselineGrid(1, 1) }
		width: ${measure}rem;
		margin: 0 auto;
		margin-bottom: ${baseLineHeight}rem;
	}

	h1 {
		${ typeBaselineGrid(2, 2) }
		text-align: center;
		font-weight: bold;
	}

	h2 {
		${ typeBaselineGrid(1.2, 1) }
		font-weight: bold;
	}

	h3 {
		font-weight: bold;
	}

	p, ul, ol, pre {
		margin-top: ${baseLineHeight}rem;
		padding: 0;
	}

	figure {
		margin: 0;
		margin-left: -${baseLineHeight}rem;
		margin-right: -${baseLineHeight}rem;
		text-align: center;
	}
	figure + figure {
		margin-top: ${baseLineHeight}rem;
	}

	img {
		width: auto;
		max-width: 100%;
		max-height: 100vh;
	}

	pre, code {
		font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
		font-size: 0.75rem;
	}

	pre {
		overflow: auto;
		width: calc(50% + (${measure}rem / 2));
		margin-left: calc((100% - ${measure}rem) / 2);
		background-color: #fafafa;
	}
	`
}

const renderMeta = (name, content) => !!content ? (
	`<meta name="${ name }" content="${ content }">`
) : ''

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

module.exports = props => (`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${ props.title }</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
${ renderMetas({
	'original-source': props.originalSourceURL
}) }
<style>${ renderStyles(props.darkMode) }</style>
${ renderElements(props.headElements) }
</head>
<body>
${ props.innerHTML }
${ renderElements(props.bodyLastElements) }
</body>
</html>
`)