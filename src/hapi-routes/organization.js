const R = require('ramda')
const Boom = require('boom')
const Joi = require('joi')
const {
	listOrganizationsForUser, createTokenForOrganizationUserCapabilities, includesCapability, createOrganization, addUserToOrganization, setS3SettingsInOrganization
	} = require('../services/cloudant/organization')
const verifyAuthedHasOrganizationCapability = require('./pre/verifyAuthedHasOrganizationCapability')
const verifyUserWithEmail = require('./pre/verifyUserWithEmail')
const pickValidations = require('./validations/pick')

module.exports = [
	{
		// List organizations for current user
		method: 'GET',
		path: '/1/@',
		config: {
			auth: 'auth0token'
		},
		handler({
			auth: { credentials: { sub: userID } }
		}, reply) {
			console.log('userID', userID)
			reply(
				listOrganizationsForUser({ userID })
			)
		}
	},
	{
		// Create organization
		method: 'PUT',
		path: '/1/@{organizationName}',
		config: {
			auth: 'auth0token',
			validate: {
				params: pickValidations([
					'organizationName'
				]),
				payload: pickValidations([
					'ownerEmail'
				])
			}
		},
		handler({
			auth: { credentials: { sub: userID } },
			params: { organizationName }
		}, reply) {
			reply(
				createOrganization({
					name: organizationName,
					userID
				})
				.then(R.always({
					success: true
				}))
			)
		}
	},
	{
		// Authorize for capabilities in organization
		method: 'POST',
		path: '/1/auth/@{organizationName}',
		config: {
			auth: 'auth0token',
			validate: {
				params: pickValidations([
					'organizationName'
				]),
				payload: Joi.object({
					requestedCapabilities: Joi.array().items(Joi.string().required()).required()
				}).required()
			}
		},
		handler({ params: { organizationName }, auth, payload: { requestedCapabilities } }, reply) {
			const userID = auth.credentials.sub
			reply(
				createTokenForOrganizationUserCapabilities({ organizationName, userID, requestedCapabilities })
			)
			// Get requested capabilities from payload
			// Check if current user is authorized for these capabilities in this organization
			// Reduces capabilities to those allowed, if none then errors
			// Generates a JWT including organization ID and capabilities
		}
	},
	{
		// Change S3 settings (access key, secret) for organization
		method: 'PUT',
		path: '/1/@{organizationName}/s3-settings',
		config: {
			auth: 'organizationToken',
			validate: {
				params: pickValidations([
					'organizationName'
				]),
				payload: Joi.object({
					accessKey: Joi.string().required(),
					secretKey: Joi.string().required(),
					region: Joi.string().required()
				}).required()
			}
		},
		handler({
			params: { organizationName },
			auth: { credentials: { sub: userID, authorizedCapabilities } },
			payload
		}, reply)
		{
			if (!includesCapability('s3SettingsAdmin', authorizedCapabilities)) {
				reply(
					Boom.unauthorized('You do not have the capability to administer S3 settings')
				)
			}

			reply(
				setS3SettingsInOrganization({
					organization: organizationName,
					userID,
					s3Settings: payload
				})
			)
		}
	},
	// FIXME: remove verifyAuthedHasOrganizationCapability
	{
		method: 'POST',
		path: '/1/@{organizationName}/invite',
		config: {
			auth: 'auth0token',
			pre: [
				{
					method: verifyAuthedHasOrganizationCapability('invite'),
					assign: 'organization'
				},
				{
					method: ({ payload: { email } }, reply) => reply(email),
					assign: 'email'
				},
				{
					method: verifyUserWithEmail(),
					assign: 'user'
				}
			]
		},
		handler(request, reply) {
			const { organization, user } = request.pre
			
			reply(
				addUserToOrganization({
					organization,
					userID: user.user_id,
					capabilities: {
						publish: true,
						invite: true
					}
				})
				.then(R.always({
					success: true
				}))
			)
		}
	}
]