const R = require('ramda')
const URL = require('url')
const { promiseItemContent, promiseStreamOfItemContent } = require('../services/cloudant/find')
const { findInIndexNamed } = require('../services/cloudant/findInIndex')
const { rendererForFormat } = require('../renderers')
const defaultTemplate = require('../templates/default')
const imgix = require('../services/imgix')

const version = '1'

module.exports = [
	{
		// Redirects to imgix URL
		method: 'GET',
		path: `/${version}/preview/image/@{organization}/{sha256}`,
		handler(request, reply) {
			const { organization, sha256 } = request.params
			//reply.redirect(`https://royalicing.imgix.net/${version}/@${organization}/${sha256}`)
			reply.redirect(
				imgix.buildURL(`/${version}/@${organization}/${sha256}`)
			)
		}
	},
	{
		// Finds item in collected index, then redirects to its imgix URL
		method: 'GET',
		path: `/${version}/preview/image/find/@{organization}/{sha256}/{name*}`,
		handler(request, reply) {
			findInIndexNamed(request.params)
			.then(
				({ organization, sha256 }) => {
					reply.redirect(
						imgix.buildURL(`/${version}/@${account}/${sha256}`, request.query)
					)
				},
				reply
			)
		}
	},
	{
		// Used by Imgix to load the source image
		method: 'GET',
		path: `/-imgix/${version}/@{organization}/{sha256}`,
		config: {
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler(request, reply) {
			promiseStreamOfItemContent(request.params)
			.then(
				reply, // Unwrap stream
				reply
			)
		}
	},
	{
		// Used by Imgix to find the source image in an index
		method: 'GET',
		path: `/-imgix/${version}/find/@{organization}/{sha256}/{name*}`,
		config: {
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler(request, reply) {
			findInIndexNamed(request.params)
			.then(
				({ organization, sha256 }) => {
					reply.redirect(`/-imgix/${version}/@${organization}/${sha256}`)
				},
				reply
			)
		}
	},
	{
		method: 'GET',
		path: `/${version}/preview/{format}/@{organization}/{sha256}`,
		config: {
			cache: {
				privacy: 'public',
				expiresIn: /* 30 days */ 30 * 24 * 60 * 60 * 1000, 
			}
		},
		handler(request, reply) {
			promiseItemContent(request.params)
			.then(
				rendererForFormat(request.params.format, {
					imgixURLForImagePath: (imagePath, options) => (
						URL.format({
							pathname: `/${version}/preview/image/find/@${request.params.organization}/${request.query.index}/${imagePath}`,
							query: options
						})
						/*imgix.buildURL(
							`/${version}/find/@${request.params.organization}/${request.query.index}/${imagePath}`,
							options
						)*/
					),
					title: request.params.sha256,
					//theme: 'gardenWhite',
				})
			)
			.then(defaultTemplate)
			.then(
				reply,
				reply
			)
		}
	}
]