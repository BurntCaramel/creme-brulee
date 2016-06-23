const R = require('ramda')
const replyPipe = require('../pre/replyPipe')
const replyPipeP = require('../pre/replyPipeP')
const { conformerForFormat } = require('../../conformers') 
const { applyTransforms } = require('../../transforms')

const transformContentHandler = R.converge((content, conformer, transformer) => (
	conformer(content).then(transformer)
), [
	R.prop('itemContent'),
	({ inputFormat }) => (
		conformerForFormat(inputFormat, {})
	),
	({ transforms = [] }) => (
		applyTransforms(transforms)
	)
])

module.exports = transformContentHandler
