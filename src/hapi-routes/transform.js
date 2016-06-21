const R = require('ramda')
const URL = require('url')
const Joi = require('joi')
const replyPromise = require('./pre/replyPromise')
const joiPromise = require('../utils/joiPromise')
const validations = require('./validations')
const preItemContent = require('./pre/itemContent')
//const { promiseItemContent, promiseStreamOfItemContent } = require('../services/cloudant/find')
const { promiseItemContent, promiseStreamOfItemContent } = require('../services/collected/find')
//const { autoRenderer } = require('../renderers')
const { rendererForFormat } = require('../renderers')
const { conformerForFormat } = require('../conformers') 
const { applyTransforms } = require('../transforms')
const defaultTemplate = require('../templates/default')

const v = '1'

const transformAndPreviewConfig = {
	handler(request, reply) {
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
							/*imgix.buildURL(
								`/${v}/find/@${request.params.account}/${request.query.index}/${imagePath}`,
								options
							)*/
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
		}
}

module.exports = [
	{
		method: 'POST',
		path: `/${v}/transform/{inputFormat}/@{organization}/{sha256}`,
		config: {
			pre: [
				{
					method: replyPromise(preItemContent('organization', 'sha256')),
					assign: 'itemContent' 
				}
			],
			validate: {
				payload: Joi.compile({
					transforms: validations.transforms
				})
			}
		},
		handler(request, reply) {
			reply(
				Promise.resolve(request.pre.itemContent)
				.then(
					conformerForFormat(request.params.inputFormat, {})
				)	
				.then(
					applyTransforms(request.payload.transforms)
				)
			)
		}
	},
	{
		method: 'POST',
		path: `/${v}/transform/{inputFormat}/preview/@{account}/{sha256}`,
		config: transformAndPreviewConfig
	},
	{
		method: 'POST',
		path: `/${v}/transform/{inputFormat}/preview:{previewFormat}/@{account}/{sha256}`,
		config: transformAndPreviewConfig
	},
	{
		method: 'GET',
		path: `/${v}/transform/{inputFormat}/@{organization}/{sha256}/using/{transformsSHA256}`,
		config: {
			pre: [
				{
					method: replyPromise(preItemContent('organization', 'sha256')),
					assign: 'itemContent' 
				},
				{
					method: replyPromise(R.pipeP(
						preItemContent('organization', 'transformsSHA256'),
						JSON.parse,
						R.prop('transforms'),
						joiPromise(validations.transforms)
					)),
					assign: 'transforms' 
				}
			],
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler(request, reply) {
			reply(
				conformerForFormat(request.params.inputFormat, {}, request.pre.itemContent)
				.then(
					applyTransforms(request.pre.transforms)
				)
			)
		}
	}
]