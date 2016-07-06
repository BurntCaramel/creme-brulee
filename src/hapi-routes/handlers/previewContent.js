const R = require('ramda')
const URL = require('url')
const { rendererForFormat } = require('../../renderers')
const defaultTemplate = require('../../templates/default')

const previewContentHandler = R.pipeP(
	R.pipe(
		R.converge(R.call, [
			({ previewFormat, organization, baseIndex, isDeserialized, theme = 'gardenWhite' }) => (
				rendererForFormat(previewFormat, {
					imgixURLForImagePath: (imagePath, options) => (
						URL.format({
							pathname: `/1/preview/image/find/@${organization}/${baseIndex}/${imagePath}`,
							query: options
						})
					),
					isDeserialized,
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
