const R = require('ramda')
const URL = require('url')
const Joi = require('joi')

const replyPipe = require('./pre/replyPipe')
const replyPipeP = require('./pre/replyPipeP')
const preMethods = require('./pre/preMethods')
const joiPromise = require('../utils/joiPromise')
const validations = require('./validations')
//const pickValidations = require('./validations/pick')

const { listTagsForItem, addTagsForItem, editTagsForItem, findTags, findItemsWithTags } = require('../services/cloudant/tag')

const v = '1'

module.exports = [
	{
		// List all tags for a collected items
		method: 'GET',
		path: `/${v}/@{organization}/sha256:{sha256}/tags`,
		config: {
			validate: {
				params: Joi.compile({
					organization: validations.organizationName,
					sha256: validations.sha256
				})
			}
		},
		handler: replyPipe(
			({ params: { organization, sha256 } }) => (
				listTagsForItem({ organization, sha256 })
			)
		)
	},
	{
		// Add tags for a collected item
		method: 'POST',
		path: `/${v}/@{organization}/sha256:{sha256}/tags`,
		config: {
			validate: {
				params: Joi.compile({
					organization: validations.organizationName,
					sha256: validations.sha256
				}),
				payload: Joi.compile({
					tags: validations.tags
				})
			}
		},
		handler: replyPipeP(
			({ params: { organization, sha256 }, payload: { tags } }) => (
				addTagsForItem({ organization, sha256, tags })
			)
		)
	},
	{
		// Edit tags for a collected item
		method: 'PATCH',
		path: `/${v}/@{organization}/sha256:{sha256}/tags`,
		config: {
			validate: {
				params: Joi.compile({
					organization: validations.organizationName,
					sha256: validations.sha256
				}),
				payload: Joi.compile({
					tags: validations.tags,
					rev: validations.rev
				})
			}
		},
		handler: replyPipeP(
			({ params: { organization, sha256 }, payload: { tags, rev } }) => (
				editTagsForItem({ organization, sha256, tags, rev })
			)
		)
	},
	{
		// Find tags
		method: 'POST',
		path: `/${v}/@{organization}/tags/search`,
		config: {
			validate: {
				params: Joi.compile({
					organization: validations.organizationName
				})
			}
		},
		handler: replyPipeP(
			({ params: { organization } }) => (
				findTags({ organization })
			)
		)
	},
	{
		// Find collected items with tags
		method: 'POST',
		path: `/${v}/@{organization}/search:tags`,
		config: {
			validate: {
				params: Joi.compile({
					organization: validations.organizationName
				}),
				payload: Joi.compile({
					tags: validations.tags
				})
			}
		},
		handler: replyPipeP(
			({ params: { organization }, payload: { tags } }) => (
				findItemsWithTags({ organization, tags })
			)
		)
	}
]