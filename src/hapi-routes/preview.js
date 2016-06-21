const R = require('ramda')
const URL = require('url')
const { promiseItemContent, promiseStreamOfItemContent, findInIndexNamed } = require('../services/collected/find')
const replyPipe = require('./pre/replyPipe')
const replyPipeP = require('./pre/replyPipeP')
const preItemContent = require('./pre/itemContent')
const { rendererForFormat } = require('../renderers')
const defaultTemplate = require('../templates/default')

const version = '1'

const previewItemContentHandler = replyPipeP(
	R.pipe(
		R.converge(R.call, [
			({ params: { format }, query, pre: { organization } }) => (
				rendererForFormat(format, {
					imgixURLForImagePath: (imagePath, options) => (
						URL.format({
							pathname: `/${version}/preview/image/find/@${organization}/${query.index}/${imagePath}`,
							query: options
						})
					),
					theme: 'gardenWhite',
				})
			),
			R.path(['pre', 'itemContent'])
		]),
		(value) => Promise.resolve(value)
	),
	defaultTemplate
)

module.exports = [
	{
		method: 'GET',
		path: `/${version}/preview/{format}/@{organization}/{sha256}`,
		config: {
			pre: [
				{
					method: replyPipe(R.path(['params', 'organization'])),
					assign: 'organization'
				},
				{
					method: replyPipe(preItemContent('organization', 'sha256')),
					assign: 'itemContent'
				}
			],
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler: previewItemContentHandler
	},
	{
		method: 'POST',
		path: `/${version}/preview:{format}/@{organization}`,
		config: {
			pre: [
				{
					method: replyPipe(R.path(['params', 'organization'])),
					assign: 'organization'
				},
				{
					method: replyPipe(
						R.prop('payload')
					),
					assign: 'itemContent'
				}
			],
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler: previewItemContentHandler
	}
]