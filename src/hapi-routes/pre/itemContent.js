const R = require('ramda')

const { promiseItemContent } = require('../../services/collected/find')
//const { promiseItemContent } = require('../../services/cloudant/find')

module.exports = (organizationID = 'organization', sha256ID = 'sha256') => R.pipe(
	R.prop('params'),
	R.props([organizationID, sha256ID]),
	R.zipObj(['organization', 'sha256']),
	promiseItemContent
)