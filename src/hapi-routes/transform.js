const R = require('ramda')
const URL = require('url')
const Joi = require('joi')
const replyPromise = require('./pre/replyPromise')
const replyPipe = require('./pre/replyPipe')
const replyPipeP = require('./pre/replyPipeP')
const joiPromise = require('../utils/joiPromise')
const validations = require('./validations')
const preItemContent = require('./pre/itemContent') 
const transformContent = require('./handlers/transformContent')
const previewContent = require('./handlers/previewContent')

const v = '1'

const transformContentHandler = replyPipe(
	R.prop('pre'),
	transformContent
)

const transformAndPreviewHandler = replyPipe(
	R.prop('pre'),
	(pre) => (
		transformContent(pre)
		.then((transformedContent) => (
			previewContent(
				R.merge(pre, { itemContent: transformedContent })
			)
		))
	)
)

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
		path: `/${v}/transform:{inputFormat}/@{organization}/{sha256}/using:{transformsSHA256}`,
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
		path: `/${v}/transform:{inputFormat}/preview:{previewFormat}/@{organization}/{sha256}`,
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
					method: replyPipe(
						R.path(['payload', 'transforms']),
						joiPromise(validations.transforms)
					),
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
			handler: transformAndPreviewHandler
		}
	},
	{
		// Transform a collected item using the uploaded transform, then preview in the requested format
		method: 'GET',
		path: `/${v}/transform:{inputFormat}/preview:{previewFormat}/@{organization}/{sha256}/using:{transformsSHA256}`,
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
			handler: transformAndPreviewHandler
		}
	}
]