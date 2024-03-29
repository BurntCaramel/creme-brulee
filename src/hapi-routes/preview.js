const R = require('ramda')
const URL = require('url')
const { promiseItemContent, promiseStreamOfItemContent, findInIndexNamed } = require('../services/collected/find')
const preMethods = require('./pre/preMethods')
const preItemContent = require('./pre/itemContent')
const preTray = require('./pre/tray')
const preGitHub = require('./pre/github')
const previewContent = require('./handlers/previewContent')

const version = '1'

const previewContentHandler = ({ pre }, reply) => reply(previewContent(pre))

module.exports = [
	{
		// Preview a tray cup
		method: 'GET',
		path: `/${version}/preview:{previewFormat}/@{organization}/trays:{trayID}:{cupID}`,
		config: {
			pre: preMethods({
				previewFormat: R.path(['params', 'previewFormat']),
				organization: R.path(['params', 'organization']),
				trays: preTray.promiseTrays,
				tray: preTray.promiseTray,
				itemContent: preTray.promiseCup,
				query: R.prop('query')
			}),
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler: previewContentHandler
	},
	{
		// Preview a file stored on GitHub
		method: 'GET',
		path: `/${version}/preview:{previewFormat}/@{organization}/github:{gitHubUsername}/{project}/{branch}/{filePath*}`,
		config: {
			pre: preMethods({
				previewFormat: R.path(['params', 'previewFormat']),
				organization: R.path(['params', 'organization']),
				gitHubUsername: R.path(['params', 'gitHubUsername']),
				project: R.path(['params', 'project']),
				branch: R.path(['params', 'branch']),
				filePath: R.path(['params', 'filePath']),
				itemContent: preGitHub.promiseRawFile,
				isDeserialized: R.T,
				query: R.prop('query')
			}),
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler: previewContentHandler
	},
	{
		// Preview a collected item
		method: 'GET',
		path: `/${version}/preview:{previewFormat}/@{organization}/{sha256}`,
		config: {
			pre: [
				preMethods({
					previewFormat: R.path(['params', 'previewFormat']),
					organization: R.path(['params', 'organization']),
					itemContent: preItemContent('organization', 'sha256'),
					query: R.prop('query')
				})
			],
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler: previewContentHandler
	},
	{
		// Preview an uploaded item
		// TODO: ensure authenticated has 'arbitrary' permission
		method: 'POST',
		path: `/${version}/preview:{previewFormat}/@{organization}`,
		config: {
			pre: [
				preMethods({
					previewFormat: R.path(['params', 'previewFormat']),
					organization: R.path(['params', 'organization']),
					itemContent: R.prop('payload'),
					query: R.prop('query')
				})
			],
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler: previewContentHandler
	}
]