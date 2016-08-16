const R = require('ramda')

const communication = require('./communication')
//const examples = require('./examples')
//const showcase = require('./showcase')
const benchtop = require('./benchtop')
//const pantry = require('./pantry')
//const account = require('./account')

exports.routes = R.unnest([
	communication.routes,
	//examples.routes,
	//showcase.routes,
	benchtop.routes,
	//pantry.routes,
	//account.routes
])
