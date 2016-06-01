const R = require('ramda')

const { promiseItemContent } = require('../../sections/cloudant/find')

module.exports = (organizationID = 'account', sha256ID = 'sha256') => R.pipe(
	R.prop('params'),
	R.props([organizationID, sha256ID]),
	R.zipObj(['account', 'sha256']),
	promiseItemContent
)