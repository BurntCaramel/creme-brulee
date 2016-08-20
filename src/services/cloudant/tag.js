const R = require('ramda')
const { resolve, reject, runNode } = require('creed')
const Boom = require('boom')

const { databases } = require('./init')
const { idForOrganizationAndHash } = require('./id')
const nodePromise = require('../../utils/nodePromise')


const listTagsForItem = ({ organization, sha256 }) => (
	databases.tags.get(idForOrganizationAndHash(organization, sha256))
	.then(
		R.pipe(
			R.props(['tags', '_rev']),
			R.zipObj(['tags', 'rev'])
		),
		R.always({ tags: [], rev: null }) // Empty array on error
	)
)

const addTagsForItem = ({ organization, sha256, tags }) => (
	databases.tags.insert({
		_id: idForOrganizationAndHash(organization, sha256),
		organization,
		sha256,
		tags
	})
	.then(
		({ rev }) => (
			resolve({ success: true, sha256, rev })
		),
		(error) => {
			if (error.statusCode === 409) {
				return reject(Boom.conflict('Tags already exit, must edit'))
			}
			else {
				return reject(Boom.wrap(error))
			}
		}	
	)
)

const editTagsForItem = ({ organization, sha256, tags, rev }) => (
	databases.tags.insert({
		_id: idForOrganizationAndHash(organization, sha256),
		_rev: rev,
		organization,
		sha256,
		tags
	})
	.then(
		({ rev }) => (
			resolve({ success: true, sha256, rev })
		),
		(error) => {
			if (error.statusCode === 409) {
				return reject(Boom.conflict('Must edit current revision'))
			}
			else {
				return reject(Boom.wrap(error))
			}
		}
	)
)

const conformTagViewResult = R.map(
	R.converge(R.unapply(R.zipObj(['tag', 'count'])), [
		R.pipe(
			R.prop('key'),
			R.last
		),
		R.prop('value')
	])
)

const findTags = ({ organization }) => (
	databases.tags.view('tags-each', 'tags', {
		group: true,
		startkey: organization
	})
	.then(
		({ rows }) => resolve({
			success: true,
			items: conformTagViewResult(rows) 
		}),
		(error) => (
			reject(Boom.wrap(error))
		)
	)
)

const conformTagFindItemsResult = R.map(R.pipe(
	R.props(['organization', 'sha256', '_rev']),
	R.zipObj(['organization', 'sha256', 'rev'])
))

const findItemsWithTags = ({ organization, sha256, tags }) => (
	databases.tags.find({
		"selector": {
			"organization": {
				"$eq": organization
			},
			"tags": {
				"$all": tags
			}
		},
		"fields": [
			//"_id",
			"organization",
			"sha256",
			"_rev"
		],
		"sort": [
			{
				"_id": "asc"
			}
		]
	})
	.then(
		({ docs }) => resolve({
			success: true,
			items: conformTagFindItemsResult(docs)
		}),
		(error) => (
			reject(Boom.wrap(error))
		)
	)
)

module.exports = {
	listTagsForItem,
	addTagsForItem,
	editTagsForItem,
	findTags,
	findItemsWithTags
}
