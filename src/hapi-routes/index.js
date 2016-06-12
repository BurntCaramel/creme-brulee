const R = require('ramda')

module.exports = R.unnest([
	require('./landing'),
	require('./seo'),
	require('./auth'),
	require('./organization'),
	
	require('./collectedGet'),
	
	//require('./collectedPublish-cloudant'),
	require('./collectedPublish-b2'),
	
	require('./preview'),
	require('./transform')
])