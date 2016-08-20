const R = require('ramda')

module.exports = R.unnest([
	// STATIC
	
	require('../sections').routes,
	//require('./landing'),
	require('./seo'),

	require('./web/slides'),
	require('./web/flambe'),

	// API

	require('./auth'),
	require('./organization'),

	require('./tags'),

	require('./trays'),
	
	require('./collectedGet'),
	
	//require('./collectedPublish-cloudant'),
	require('./collectedPublish-b2'),
	
	require('./preview'),
	require('./transform'),
	require('./template')
])