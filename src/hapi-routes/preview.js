const R = require('ramda')
const URL = require('url')
const { promiseItemContent, promiseStreamOfItemContent, findInIndexNamed } = require('../services/collected/find')
const preMethods = require('./pre/preMethods')
const preItemContent = require('./pre/itemContent')
const previewContent = require('./handlers/previewContent')

const version = '1'

const previewContentHandler = ({ pre }, reply) => reply(previewContent(pre))

module.exports = [
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