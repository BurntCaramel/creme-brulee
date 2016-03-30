const R = require('ramda')

const formatToRenderers = {
	md: require('./md'),
	icing: require('./icing'),
	plain: require('./plain'),
};

const rendererForFormat = (format, rendererOptions) => (
	(formatToRenderers[format] || formatToRenderers.plain)(rendererOptions)
)

module.exports.rendererForFormat = rendererForFormat;
