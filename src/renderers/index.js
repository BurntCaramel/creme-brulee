const R = require('ramda')

const formatToRenderers = {
	plain: require('./plain'),
	md: require('./md'),
	icing: require('./icing'),
	json: require('./json'),
	svg: require('./svg'),
	auto: require('./auto')
}

const rendererForFormat = R.uncurryN(3, (format, rendererOptions) => (
	(formatToRenderers[format] || formatToRenderers.auto)(rendererOptions)
))

module.exports = {
	rendererForFormat,
	autoRenderer: formatToRenderers.auto
}
