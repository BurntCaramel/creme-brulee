const R = require('ramda')
const { conformerForFormat } = require('../../conformers') 
const { applyTransforms } = require('../../transforms')

const transformContentHandler = R.converge((content, conformer, transformer) => (
	conformer(content).then(transformer)
), [
	R.prop('itemContent'),
	R.pipe(
		R.prop('inputFormat'),
		conformerForFormat(R.__, {})
	),
	R.pipe(
		R.prop('transforms'),
		R.defaultTo([]),
		applyTransforms
	)
])

module.exports = transformContentHandler
