const R = require('ramda')
const Boom = require('boom')
const Joi = require('joi')
const { createOrganization, addUserToOrganization } = require('../services/cloudant/organization')
const verifyAuthedHasOrganizationCapability = require('./pre/verifyAuthedHasOrganizationCapability')
const verifyUserWithEmail = require('./pre/verifyUserWithEmail')
const pickValidations = require('./validations/pick')

module.exports = [
	{
		method: 'PUT',
		path: '/1/@{organizationName}',
		config: {
			auth: 'token',
			validate: {
				params: pickValidations([
					'organizationName'
				]),
				payload: pickValidations([
					'ownerEmail'
				])
			}
		},
		handler(request, reply) {
			const { organizationName } = request.params
			const { ownerEmail } = request.payload
			const userID = request.auth.credentials.sub
			
			reply(
				createOrganization({
					name: organizationName,
					userID,
					ownerEmail,
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
	},
	{
		method: 'POST',
		path: '/1/@{organizationName}/invite/{email}',
		config: {
			auth: 'token',
			pre: [
				{
					method: verifyAuthedHasOrganizationCapability('invite'),
					assign: 'organization'
				},
				{
					method: verifyUserWithEmail(
						(email) => Boom.preconditionFailed(`Must create account using email ${email} first`, { email })
					),
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