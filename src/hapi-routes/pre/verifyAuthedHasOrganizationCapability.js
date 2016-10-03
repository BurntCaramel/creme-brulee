const R = require('ramda')
const Boom = require('boom')
const { findOrganizationNamed } = require('../../services/cloudant/organization')

const verifyAuthedHasOrganizationCapability = (capability) => (request, reply) => {
	const { organizationName } = request.params
	const userID = request.auth.credentials.sub
	
	reply(
		findOrganizationNamed(organizationName)
		.then(R.tap((organization) => {
			console.log('organization', R.path(['userCapabilities', userID], organization), userID, capability)
		}))
		.then(R.unless(
			R.pathEq(['userCapabilities', userID, capability], true),
			() => { throw Boom.unauthorized(`You don’t have permission to ${capability} in this organization`) }
		))
	)
}

module.exports = verifyAuthedHasOrganizationCapability
