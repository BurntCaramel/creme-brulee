const R = require('ramda')

module.exports = R.unnest([
	// STATIC
	
	require('./landing'),
	require('./seo'),

	require('./web/slides'),

	// API

	require('./auth'),
	require('./organization'),

	require('./trays'),
	
	require('./collectedGet'),
	
	//require('./collectedPublish-cloudant'),
	require('./collectedPublish-b2'),
	
	require('./preview'),
	require('./transform'),
	require('./template')
])