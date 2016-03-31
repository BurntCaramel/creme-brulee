const Immutable = require('immutable')
const R = require('ramda')
const previewHTMLWithContent = require('icing-display/lib/presentation').previewHTMLWithContent
const spec = Immutable.fromJS(require('icing-spec-burnt/default/1.0'))
const createElement = require('react').createElement

const urlIsAbsolute = R.test(/:\/\//)

const adjustBlock_options = (options) => (block) => {
	const typeGroup = block.get('typeGroup')
	const type = block.get('type')
	
	if (typeGroup === 'media' && type === 'externalImage') {
		const imageURL = block.getIn(['value', 'url'])
		console.log('imageURL', imageURL, block, block.toJSON())
		const isAbsolute = urlIsAbsolute(imageURL) 
		if (!isAbsolute) {
			const imgixImageURL = options.imgixURLForImagePath(imageURL)
			block = block.setIn(['value', 'url'], imgixImageURL)
		}
	}
	
	return block
}

function attributesForResponsiveImage(options, imagePath, width) {
	width = R.defaultTo(700, width)
	const url1x = options.imgixURLForImagePath(imagePath, { w: width, q: 80, auto: 'format,compress' })
	const url2x = options.imgixURLForImagePath(imagePath, { w: width, fit: 'max', dpr: 2, q: 50, auto: 'format,compress' }) 
	 
	return {
		srcSet: [
			`${ url1x } 1x`,
			`${ url2x } 2x`,
		].join(','),
		src: url1x,
		width
	}
}

function renderResponsiveImage(options, imageURL, width) {
	return createElement('img',
		attributesForResponsiveImage(options, imageURL, width)
	)
}

const renderBlock_options = (options) => (block) => {
	const typeGroup = block.get('typeGroup')
	const type = block.get('type')
	const value = block.get('value')
	
	if (typeGroup === 'media' && type === 'externalImage') {
		const imageURL = value.get('url')
		const isAbsolute = urlIsAbsolute(imageURL)
		
		if (!isAbsolute) {
			return createElement('figure', null,
				renderResponsiveImage(options, imageURL, value.get('width'))
			)
		}
	}
}

module.exports = function icingFormatter(options) {
	//const adjustBlock = adjustBlock_options(options)
	const renderBlock = renderBlock_options(options)
	
	return (input) => ({
		innerHTML: previewHTMLWithContent(
			Immutable.fromJS(JSON.parse(input).sections.main),
			spec,
			{ pretty: true, renderBlock }
		)
	})
}
