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

	return createElement('figure', {
		className: 'ratio-16-9',
		dangerouslySetInnerHTML: { __html: embedCode }
	})
}

function VideoEmbedList({ videoInfos, showFork = true, showProvider = true }) {
	return createElement('div',
		null,
		videoInfos.map((videoInfo, index) => (
			createElement(VideoEmbed, R.merge({ key: index }, { videoInfo }))
		)),
		createElement('nav', { key: 'controls' }, [
			showFork && createElement('a', { href: '#fork', key: 'fork' }, 'Use my content'),
			showProvider && createElement('a', { href: '/', key: 'provider' }, 'Provided by Royal Icing')
		])
	)
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
				createElement(VideoEmbedList, { videoInfos })
			)
		})
	}
)