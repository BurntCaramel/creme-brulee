const R = require('ramda')

module.exports = R.unnest([
	require('./landing'),
	require('./seo'),
	require('./auth'),
	require('./organization'),
	require('./collected'),
	require('./collectedFind'),
	require('./collectedPublish'),
	require('./preview'),
	require('./transform')
])