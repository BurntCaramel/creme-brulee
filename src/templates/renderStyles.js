const R = require('ramda')

const themes = require('./themes')
const getThemeWithID = R.pipe(
	R.defaultTo('light'),
	R.prop(R.__, themes)
)

function renderStyles(themeID) {
	const theme = getThemeWithID(themeID)
	 
	const measure = 30
	const baseFontSize = 18
	const baseLineHeight = 1.333333333
	const fontFamilyStack = 'system, "-apple-system", "-webkit-system-font", BlinkMacSystemFont, "Helvetica Neue", "Helvetica", "Segoe UI", "Roboto", "Arial", "freesans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
	const backgroundColor = theme.backgroundColor
	const color = theme.color
	//const linkColor = '#3999e7'
	const linkColor = '#eb1a4e'
	const preBackgroundColor = theme.backgroundColor
	//const baselineGridRule = 'background-image: repeating-linear-gradient(to bottom, transparent 0px, transparent 1.29rem, red 1.29em, red 1.333333333rem);' 
	const baselineGridRule = ''
	
	const base = 'article'
	
	const cssProp = (key, value) => `${key}: ${value};`
	const withPrefixes = (key, value, prefixes) => prefixes.concat('').map(prefix => cssProp(`${prefix}${key}`, value)).join(' ')

	function typeBaselineGrid(fontSize, lineHeightFactor) {
		const lineHeight = baseLineHeight * lineHeightFactor;
		return `
	position: relative;
	font-size: ${fontSize}rem;
	line-height: ${lineHeight}rem;
	top: ${ lineHeight - fontSize }rem;
`
	}

	return `
html {
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
	${ withPrefixes('hypens', 'auto', ['-webkit-', '-ms-']) }
	${baselineGridRule}
}

${base} * {
	max-width: ${measure}rem;
	margin: auto;
	padding: 0;
}

${base} > * {
	${ typeBaselineGrid(1, 1) }
}

${base} a {
	color: ${linkColor};
	text-decoration: none;
}
${base} nav {
	display: flex;
}
${base} nav a {
	display: inline-block;
	width: auto;
	padding: ${baseLineHeight * 0.5}rem 0.875em;
	background-color: ${linkColor};
	color: white;
}

${base} h1,
${base} h2,
${base} h3,
${base} > p,
${base} ul,
${base} ol,
${base} dt,
${base} pre,
${base} hr {
	margin-bottom: ${baseLineHeight}rem;
}

${base} h1 {
	${ typeBaselineGrid(2, 2) }
	font-weight: bold;
}

${base} h2 {
	${ typeBaselineGrid(1.2, 1) }
	font-weight: bold;
}

${base} h3,
${base} nav dt {
	text-transform: uppercase;
	font-weight: bold;
}

${base} pre {
	overflow: auto;
	width: calc(50% + (${measure}rem / 2));
	margin-left: calc((100% - ${measure}rem) / 2);
	background-color: ${preBackgroundColor};
}

${base} ${base},
${base} dl,
${base} dd,
${base} figure {
	margin: auto;
	width: auto;
}

${base} dt {
	margin-bottom: 0;
	font-weight: bold;
}
${base} dd {
	margin-left: 1em;
	margin-right: 0;
}

h1,
h1 + h2 {
	text-align: center;
}

figure {
	margin: 0;
	margin-left: -${baseLineHeight}rem;
	margin-right: -${baseLineHeight}rem;
	text-align: center;
}
figure + figure,
${base} nav {
	margin-top: ${baseLineHeight}rem;
}
figure.ratio-16-9 {
	position: relative;
	height: 0;
	padding-bottom: ${9 / 16 * 100}%;
}
figure.ratio-16-9 iframe {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
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

hr {
	border: none;
	border-top: 1px solid ${color}
}
`
}

module.exports = renderStyles
