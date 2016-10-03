const R = require('ramda')
const { resolve, reject } = require('creed')
const Boom = require('boom')
const JWT = require('jsonwebtoken')


const { databases } = require('./init')
const nodePromise = require('../../utils/nodePromise')
const conformPromiseError = require('../../utils/conformPromiseError')

const defaultOwnerCapabilties = {
	super: true,
	//publish: true,
	invite: true,
	itemsPublish: true,
	itemsRead: true,
	tagsEdit: true,
	tagsRead: true,
	catalogEdit: true,
	catalogRead: true,
	s3SettingsAdmin: true,
	s3Write: true,
	s3Read: true,
	showcaseEdit: true
}

const includesCapability = R.uncurryN(2, (capability) => R.anyPass([
	R.contains('super'),
	R.contains(capability)
]))

const createOrganization = ({ name, ownerEmail, userID, capabilities = defaultOwnerCapabilties, allowedPublishersCount = 0 }) => (
	conformPromiseError(
		databases.organizations.insert({
			_id: name,
			name,
			ownerID: userID,
			userCapabilities: {
				[userID]: capabilities
			},
			allowedPublishersCount
		}), R.cond([
			[ R.equals(409), () => (`Organization with name '${name}' already exists`) ]
		])
	)
)

const findOrganizationNamed = (name) => (
	databases.organizations.find({
		selector: { name }
	})
	.map(R.path(['docs', 0]))
)

const conformOrganizationFindItemsResult = R.map(R.pipe(
	R.props(['_id', 'name', '_rev']),
	R.zipObj(['id', 'name', 'rev'])
))

const listOrganizationsForUser = ({ userID }) => (
	databases.organizations.find({
		"selector": {
			"ownerID": {
				"$eq": userID
			}
		},
		"fields": [
			"_id",
			"name",
			"_rev"
		],
		"sort": [
			{
				"_id": "asc"
			}
		]
	})
	.map(({ docs }) => ({
		success: true,
		items: conformOrganizationFindItemsResult(docs)
	}))
	.catch(R.pipe(
		Boom.wrap,
		reject
	))
	/*.then(
		({ docs }) => resolve({
			success: true,
			items: conformOrganizationFindItemsResult(docs)
		}),
		(error) => (
			reject(Boom.wrap(error))
		)
	)*/
)

const createTokenForOrganizationUserCapabilities = ({ organizationName, userID, requestedCapabilities }) => {
	console.log('createTokenForOrganizationUserCapabilities', { organizationName, userID, requestedCapabilities })
	return findOrganizationNamed(organizationName)
	.then((organization) => {
		console.log('organization', organization)
		const actualCapabilities = organization.userCapabilities[userID]
		console.log('actualCapabilities', actualCapabilities)
		if (!actualCapabilities) {
			return reject(Boom.unauthorized(`User is not authorized for organization @${organizationName}`))
		}

		const authorizedCapabilities = R.propEq('super', true, actualCapabilities) ? (
			requestedCapabilities
		) : (
			R.intersection(
				R.keys(actualCapabilities),
				requestedCapabilities
			)
		)
		console.log('authorizedCapabilities', authorizedCapabilities)

		if (authorizedCapabilities.length === 0) {
			const requestedCapabilitiesDisplay = requestedCapabilities.join(',')
			return reject(Boom.unauthorized(`User does not have capabilities ${requestedCapabilitiesDisplay} for organization @${organizationName}`))
		}

		return resolve(
			JWT.sign({
				//userID,
				organizationName,
				authorizedCapabilities
			}, new Buffer(process.env.ROYAL_ICING_CLIENT_SECRET, 'base64'), {
				expiresIn: '5 days',
				issuer: 'icing.space',
				subject: userID,
				audience: `icing.space` // Verified in run-hapi.js
				//audience: `organization:${organizationName}`
			})
		)
		.map(R.objOf('token'))
	})
}

const addUserToOrganization = ({ organization, userID, capabilities }) => (
	databases.organizations.insert(R.mergeWith(
		R.merge,
		organization,
		{
			userCapabilities: {
				[userID]: capabilities
			}
		}
	))
)

const setS3SettingsInOrganization = ({ organization, userID, s3Settings /* { accessKey, secretKey, region } */ }) => (
	databases.organizations.insert(R.mergeWith(
		R.merge,
		organization,
		{
			s3Settings,
			lastEditedUserID: userID
		}
	))
)

module.exports = {
	createOrganization,
	findOrganizationNamed,
	listOrganizationsForUser,
	createTokenForOrganizationUserCapabilities,
	addUserToOrganization,
	setS3SettingsInOrganization
}
