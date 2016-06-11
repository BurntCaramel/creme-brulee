const R = require('ramda')

module.exports = R.unnest([
	require('./landing'),
	require('./seo'),
	require('./auth'),
	require('./organization'),
	
	require('./collectedGet'),
	//require('./collectedFind'),
	
	//require('./collectedGet-cloudant'),
	require('./collectedPublish-cloudant'),
	//require('./collectedFind-cloudant'),
	
	//require('./collected-b2'),
	//require('./collectedPublish-b2'),
	//require('./collectedFind-b2'),
	
	require('./preview'),
	require('./transform')
])