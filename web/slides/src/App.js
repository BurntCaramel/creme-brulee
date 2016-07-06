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
		const { json } = this.state
		const { slides, backgroundColor = '#222' } = Array.isArray(json) ? { slides: json } : json

		return (
			<Spectacle bgColor={ backgroundColor }>
				<Deck transition={[ "zoom", "slide" ]} bgColor={ backgroundColor }>
					{ slides.map((slideOrSource, index) => {
						const slide = (typeof slideOrSource === 'string') ? { markdownSource: slideOrSource } : slideOrSource
						const { transition, markdownSource, textColor, backgroundColor, backgroundImage, backgroundDarken } = slide

						return (
							<Slide key={ index }
								transition={ transition }
								textColor={ textColor }
								bgColor={ backgroundColor }
								bgImage={ backgroundImage }
								bgDarken={ backgroundDarken }
							>
								<Markdown source={ markdownSource } />
							</Slide>
						)
					}) }
				</Deck>
			</Spectacle>
		)
	}
})
