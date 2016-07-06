const R = require('ramda')

const formatToRenderers = {
	plain: require('./plain'),
	md: require('./md'),
	icing: require('./icing'),
	json: require('./json'),
	svg: require('./svg'),
	piping: require('./piping'),
	video: require('./video'),
	slides: require('./slides'),
	auto: require('./auto')
}

const rendererForFormat = R.uncurryN(3, R.pipe(
	R.prop(R.__, formatToRenderers),
	R.defaultTo(formatToRenderers.auto)
))

module.exports = {
	rendererForFormat,
	autoRenderer: formatToRenderers.auto
}
