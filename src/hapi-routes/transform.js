const R = require('ramda')
const URL = require('url')
const CSV = require('csv')
const nodePromise = require('../utils/nodePromise')
const { promiseItemContent, promiseStreamOfItemContent } = require('../sections/cloudant/find')
const { autoRenderer } = require('../renderers')
const { conformerForFormat } = require('../conformers') 
const { applyTransforms } = require('../transforms')
const defaultTemplate = require('../templates/default')

const v = '1'

module.exports = [
	{
		method: 'POST',
		path: `/${v}/transform/{inputFormat}/@{account}/{sha256}`,
		handler(request, reply) {
			reply(
				promiseItemContent(request.params)
				/*.then((data) => nodePromise((callback) => {
					CSV.parse(data, {
						columns: true
					}, callback)
				}))*/
				.then(
					conformerForFormat(request.params.inputFormat, {})
				)	
				.then(
					applyTransforms(request.payload.transforms)
				)
				.catch((error) => {
					console.error(error)
					throw error
				})
			)
		}
	},
	{
		method: 'POST',
		path: `/${v}/transform/{inputFormat}/preview/@{account}/{sha256}`,
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
					autoRenderer({
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
]