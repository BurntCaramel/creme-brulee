const R = require('ramda')
const URL = require('url')
const { promiseItemContent, promiseStreamOfItemContent, findInIndexNamed } = require('../services/collected/find')
//const { promiseItemContent, promiseStreamOfItemContent } = require('../services/cloudant/find')
//const { findInIndexNamed } = require('../services/cloudant/findInIndex')
const replyPipe = require('./pre/replyPipe')
const preItemContent = require('./pre/itemContent')
const { rendererForFormat } = require('../renderers')
const defaultTemplate = require('../templates/default')
const imgix = require('../services/imgix')

const version = '1'

module.exports = [
	{
		method: 'GET',
		path: `/${version}/preview/{format}/@{organization}/{sha256}`,
		config: {
			pre: [
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
		handler: replyPipe(
			R.converge(R.call, [
				({ params: { format, organization, sha256 }, query }) => (
					rendererForFormat(format, {
						imgixURLForImagePath: (imagePath, options) => (
							URL.format({
								pathname: `/${version}/preview/image/find/@${organization}/${query.index}/${imagePath}`,
								query: options
							})
						),
						title: sha256,
						theme: 'gardenWhite',
					})
				),
				R.path(['pre', 'itemContent'])
			]),
			defaultTemplate
		)
	},
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
						imgix.buildURL(`/${version}/@${organization}/${sha256}`, request.query)
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
	}
]