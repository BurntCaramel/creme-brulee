const R = require('ramda')
const URL = require('url')
const Joi = require('joi')
const replyPromise = require('./pre/replyPromise')
const replyPipe = require('./pre/replyPipe')
const replyPipeP = require('./pre/replyPipeP')
const joiPromise = require('../utils/joiPromise')
const validations = require('./validations')
const preItemContent = require('./pre/itemContent')
//const { promiseItemContent, promiseStreamOfItemContent } = require('../services/cloudant/find')
const { promiseItemContent, promiseStreamOfItemContent } = require('../services/collected/find')
//const { autoRenderer } = require('../renderers')
const { rendererForFormat } = require('../renderers')
const { conformerForFormat } = require('../conformers') 
const { applyTransforms } = require('../transforms')
const transformContent = require('./handlers/transformContent')
const previewContent = require('./handlers/previewContent')
const defaultTemplate = require('../templates/default')

const transformContentHandler = ({ pre }, reply) => reply(transformContent(pre))

/*const transformContentHandler = R.uncurryN(2, R.pipe(
	R.prop('pre'),
	transformContent,
	(promise) => (reply) => reply(promise)
))*/

const v = '1'

const transformAndPreviewConfig = {
	pre: [
		{
			method: replyPipe(R.path(['params', 'inputFormat'])),
			assign: 'inputFormat'
		},
		{
			method: replyPipeP(preItemContent('organization', 'sha256')),
			assign: 'itemContent' 
		},
		{
			method: replyPipe(R.path(['payload', 'transforms'])),
			assign: 'transforms'
		},
		{
			method: replyPipe(R.path(['params', 'previewFormat'])),
			assign: 'previewFormat'
		},
		{
			method: replyPipe(R.path(['query', 'index'])),
			assign: 'baseIndex'
		},
		{
			method: replyPipe(R.path(['query', 'theme'])),
			assign: 'theme'
		}
	],
	handler: replyPipe(
		({ pre }) => (
			transformContent(pre)
			.then((transformedContent) => (
				previewContent(R.merge(pre, { itemContent: transformedContent }))
			))
		)
	)
	/*handler(request, reply) {
		reply(
			promiseItemContent(request.params)
			.then(
				conformerForFormat(request.params.inputFormat, {})
			)
			.then(
				applyTransforms(request.payload.transforms || [])
			)
			.then(
				rendererForFormat(request.params.previewFormat, {
					imgixURLForImagePath: (imagePath, options) => (
						URL.format({
							pathname: `/${v}/preview/image/find/@${request.params.account}/${request.query.index}/${imagePath}`,
							query: options
						})
					),
					title: request.params.sha256,
					theme: 'gardenWhite',
				})
			)
			.then(defaultTemplate)
			.catch((error) => {
				console.error(error)
				throw error
			})
		)
	}*/
}

module.exports = [
	{
		// Transform a collected item using the uploaded transform
		method: 'POST',
		path: `/${v}/transform:{inputFormat}/@{organization}/{sha256}`,
		config: {
			validate: {
				payload: Joi.compile({
					transforms: validations.transforms
				})
			},
			pre: [
				{
					method: replyPipe(R.path(['params', 'inputFormat'])),
					assign: 'inputFormat'
				},
				{
					method: replyPipeP(preItemContent('organization', 'sha256')),
					assign: 'itemContent' 
				},
				{
					method: replyPipe(R.path(['payload', 'transforms'])),
					assign: 'transforms'
				}
			]
		},
		handler: transformContentHandler
	},
	{
		// Transform a collected item using the collected transform
		method: 'GET',
		path: `/${v}/transform/{inputFormat}/@{organization}/{sha256}/using/{transformsSHA256}`,
		config: {
			pre: [
				{
					method: replyPipe(R.path(['params', 'inputFormat'])),
					assign: 'inputFormat'
				},
				{
					method: replyPipeP(preItemContent('organization', 'sha256')),
					assign: 'itemContent' 
				},
				{
					method: replyPipeP(
						preItemContent('organization', 'transformsSHA256'),
						JSON.parse,
						R.prop('transforms'),
						joiPromise(validations.transforms)
					),
					assign: 'transforms' 
				}
			],
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler: transformContentHandler
	},
	{
		// Transform a collected item using the uploaded transform, then preview in the requested format
		method: 'POST',
		path: `/${v}/transform:{inputFormat}/preview:{previewFormat}/@{account}/{sha256}`,
		config: transformAndPreviewConfig
	},
	{
		// Transform a collected item using the uploaded transform, then preview automatically determining the previewing format
		method: 'POST',
		path: `/${v}/transform:{inputFormat}/preview/@{account}/{sha256}`,
		config: transformAndPreviewConfig
	}
]