const R = require('ramda')
const URL = require('url')
const { promiseItemContent, promiseStreamOfItemContent, findInIndexNamed } = require('../services/collected/find')
const replyPipe = require('./pre/replyPipe')
const replyPipeP = require('./pre/replyPipeP')
const preItemContent = require('./pre/itemContent')
const previewContent = require('./handlers/previewContent')
const { rendererForFormat } = require('../renderers')
const defaultTemplate = require('../templates/default')

const version = '1'

const previewContentHandler = ({ pre }, reply) => reply(previewContent(pre))

module.exports = [
	{
		// Preview a collected item
		method: 'GET',
		path: `/${version}/preview:{format}/@{organization}/{sha256}`,
		config: {
			pre: [
				{
					method: replyPipe(R.path(['params', 'format'])),
					assign: 'previewFormat'
				},
				{
					method: replyPipe(R.path(['params', 'organization'])),
					assign: 'organization'
				},
				{
					method: replyPipe(preItemContent('organization', 'sha256')),
					assign: 'itemContent'
				},
				{
					method: replyPipe(R.prop('query')),
					assign: 'query'
				}
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
		path: `/${version}/preview:{format}/@{organization}`,
		config: {
			pre: [
				{
					method: replyPipe(R.path(['params', 'format'])),
					assign: 'previewFormat'
				},
				{
					method: replyPipe(R.path(['params', 'organization'])),
					assign: 'organization'
				},
				{
					method: replyPipe(R.prop('payload')),
					assign: 'itemContent'
				},
				{
					method: replyPipe(R.prop('query')),
					assign: 'query'
				}
			],
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler: previewContentHandler
	}
]