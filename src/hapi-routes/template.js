const R = require('ramda')
const Joi = require('joi')
const replyPipe = require('./pre/replyPipe')
const preMethods = require('./pre/preMethods')
const joiPromise = require('../utils/joiPromise')
const validations = require('./validations')
const preItemContent = require('./pre/itemContent') 
const fillPlaceholdersHandler = require('./handlers/fillPlaceholders')
const previewContent = require('./handlers/previewContent')

const v = '1'

const templateHandler = replyPipe(
	R.prop('pre'),
	fillPlaceholdersHandler
)

const templateAndPreviewHandler = replyPipe(
	R.prop('pre'),
	(pre) => (
		fillPlaceholdersHandler(pre)
		.then((transformedContent) => (
			previewContent(
				R.merge(pre, { itemContent: transformedContent })
			)
		))
	)
)

module.exports = [
	{
		// Replace a template’s placeholders with content
		method: 'POST',
		path: `/${v}/template/@{organization}`,
		config: {
			pre: [
				preMethods({
					template: R.path(['payload', 'template']),
					placeholdersToReplacements: R.path(['payload', 'placeholdersToReplacements'])
				})
			]
		},
		handler: templateHandler
	},
	{
		// Replace a template’s placeholders with content
		method: 'POST',
		path: `/${v}/template/preview:{previewFormat}/@{organization}`,
		config: {
			pre: [
				preMethods({
					template: R.path(['payload', 'template']),
					placeholdersToReplacements: R.path(['payload', 'placeholdersToReplacements']),
					previewFormat: R.path(['params', 'previewFormat'])
				})
			]
		},
		handler: templateAndPreviewHandler
	}
]