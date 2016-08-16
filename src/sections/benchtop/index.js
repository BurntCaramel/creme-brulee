const R = require('ramda')
const { createElement } = require('react')
//const FondantEditor = require('fondant-react')
//const { base16ToEmoji } = require('emojid')

const renderElement = require('../../templates/react')

exports.routes = [
	{
		method: 'GET',
		path: `/benchtop/@{organization}/sha256:{sha256}`, // marble?
		handler({ params: { organization, sha256 }}, reply) {
			reply('Coming soon')
			/*reply(
				renderTemplate({
					title: `Edit recipe`,
					innerHTML: renderElement({
						title: `Editing recipe from @{organization}`,
						element: createElement(FondantEditor, {
							initialTransforms: []
						})
					})
				})
			)*/
		}
	}
]