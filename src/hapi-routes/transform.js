const R = require('ramda')
const URL = require('url')
const Joi = require('joi')
const replyPipe = require('./pre/replyPipe')
const replyPipeP = require('./pre/replyPipeP')
const preMethods = require('./pre/preMethods')
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
				preMethods({
					inputFormat: R.path(['params', 'inputFormat']),
					itemContent: preItemContent('organization', 'sha256'),
					transforms: R.path(['payload', 'transforms'])
				})
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
				preMethods({
					inputFormat: R.path(['params', 'inputFormat']),
					itemContent: preItemContent('organization', 'sha256'),
					transforms: R.pipeP(
						preItemContent('organization', 'transformsSHA256'),
						JSON.parse,
						R.prop('transforms'),
						joiPromise(validations.transforms)
					)
				})
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
			validate: {
				payload: Joi.compile({
					transforms: validations.transforms
				})
			},
			pre: [
				preMethods({
					inputFormat: R.path(['params', 'inputFormat']),
					itemContent: preItemContent('organization', 'sha256'),
					transforms: R.path(['payload', 'transforms']),
					previewFormat: R.path(['params', 'previewFormat']),
					baseIndex: R.path(['query', 'index']),
					theme: R.path(['query', 'theme']),
				})
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
				preMethods({
					inputFormat: R.path(['params', 'inputFormat']),
					itemContent: preItemContent('organization', 'sha256'),
					transforms: R.pipeP(
						preItemContent('organization', 'transformsSHA256'),
						JSON.parse,
						R.prop('transforms'),
						joiPromise(validations.transforms)
					),
					previewFormat: R.path(['params', 'previewFormat']),
					baseIndex: R.path(['query', 'index']),
					theme: R.path(['query', 'theme']),
				})
			],
			handler: transformAndPreviewHandler
		}
	}
]