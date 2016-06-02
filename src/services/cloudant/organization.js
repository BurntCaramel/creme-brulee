const R = require('ramda')
const Boom = require('boom')
const { databases } = require('./init')
const nodePromise = require('../../utils/nodePromise')

const createOrganization = ({ name, ownerEmail, userID, capabilities, allowedPublishersCount = 0 }) => (
	nodePromise.conformedError((callback) => {
		console.log('databases.organizations.insert')
		databases.organizations.insert({
			_id: name,
			name,
			owner: {
				email: ownerEmail
			},
			userCapabilities: {
				[userID]: capabilities
			},
			allowedPublishersCount
		}, (error, result) => {
			console.log('result', error, result)
			callback(error, result)
		})
	}, R.cond([
		[ R.equals(409), () => (`Organization with name '${name}' already exists`) ]
	]))
)

const findOrganizationNamed = (name) => (
	nodePromise((callback) => {
		databases.organizations.find({
			selector: { name }
		}, callback)
	})
)

const addUserToOrganization = ({ organization, userID, capabilities }) => (
	nodePromise((callback) => {
		databases.organizations.insert(R.mergeWith(
			R.merge,
			organization,
			{
				userCapabilities: {
					[userID]: capabilities
				}
			}
		), callback)
	})
)

module.exports = {
	createOrganization,
	findOrganizationNamed,
	addUserToOrganization
}
