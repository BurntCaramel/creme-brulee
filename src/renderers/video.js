const R = require('ramda')
const Boom = require('boom')
const { createElement } = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const SilverScreen = require('silver-screen')

function VideoEmbed({ videoInfo }) {
	if (!videoInfo) {
		return createElement('div', {}, 'Unknown video type')
	}

	const { desktopSize: { embedCode } } = videoInfo

	return createElement('div', {
		className: 'embeddedVideo embeddedVideo-16-9',
		dangerouslySetInnerHTML: { __html: embedCode }
	})
}

module.exports = (options) => R.pipeP(
	R.pipe( 
		R.map((videoURL) => {
			return SilverScreen.infoForVideoWithURL(videoURL, {
				embedding: {
					width: 1000
				}
			})
			.catch((error) => {
				if (error.noHandler) {
					return null
				}

				console.error(error)
				throw error
			})
		}),
		(promises) => Promise.all(promises)
	),
	(videoInfos) => {
		return R.merge(options, {
			innerHTML: renderToStaticMarkup(
				createElement('div',
					null,
					videoInfos.map((videoInfo, index) => (
						createElement(VideoEmbed, R.merge({ key: index }, { videoInfo }))
					))
				)
			)
		})
	}
)