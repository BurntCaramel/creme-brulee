const R = require('ramda')

const formatToConformers = {
	csv: require('./csv'),
	json: require('./json'),
	passthrough: (options) => Promise.resolve
}

// Change to curry like this? (options, format, content)
const conformerForFormat = R.uncurryN(3, (format) => (
	formatToConformers[format] || formatToConformers.passthrough
))

module.exports = {
	conformerForFormat
}
