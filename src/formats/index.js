const R = require('ramda')

const formatToRenderers = {
	plain: require('./plain'),
	md: require('./md'),
	icing: require('./icing'),
	json: require('./json'),
	svg: require('./svg'),
};

const rendererForFormat = (format, rendererOptions) => (
	(formatToRenderers[format] || formatToRenderers.plain)(rendererOptions)
)

module.exports.rendererForFormat = rendererForFormat;
