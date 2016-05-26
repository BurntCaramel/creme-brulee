const { findOrganizationNamed } = require('../../sections/cloudant/organization')

function verifyOrganization(request, reply) {
	const { organizationName } = request.params
	
	reply(
		findOrganizationNamed(organizationName)
	)
}

module.exports = verifyOrganization