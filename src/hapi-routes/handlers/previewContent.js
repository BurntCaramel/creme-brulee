const R = require('ramda')
const URL = require('url')
const replyPipeP = require('../pre/replyPipeP')
const { rendererForFormat } = require('../../renderers')
const defaultTemplate = require('../../templates/default')

const previewContentHandler = R.pipeP(
	R.pipe(
		R.converge(R.call, [
			({ previewFormat, organization, baseIndex, theme = 'gardenWhite' }) => (
				rendererForFormat(previewFormat, {
					imgixURLForImagePath: (imagePath, options) => (
						URL.format({
							pathname: `/1/preview/image/find/@${organization}/${baseIndex}/${imagePath}`,
							query: options
						})
					),
					theme
				})
			),
			R.prop('itemContent')
		]),
		(value) => Promise.resolve(value)
	),
	defaultTemplate
)

module.exports = previewContentHandler
