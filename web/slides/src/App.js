import React from 'react'
const { Spectacle, Deck, Slide, Markdown } = require('spectacle')

function readJSON() {
	const element = document.getElementById('json')
	return JSON.parse(element.innerText)
}

export default React.createClass({
	getInitialState() {
		return {
			json: readJSON()
		}
	},

	render() {
		const markdownTexts = [].concat(this.state.json)

		return (
			<Spectacle>
				<Deck transition={[ "zoom", "slide" ]}>
					{ markdownTexts.map((markdownText, index) => (
						<Slide key={ index }>
							<Markdown source={ markdownText } />
						</Slide>
					)) }
				</Deck>
			</Spectacle>
		)
	}
})
