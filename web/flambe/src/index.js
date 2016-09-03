import React from 'react'
import { render } from 'react-dom'

import App from './App'

const appElements = document.querySelectorAll('.flambe-app')
for (var i = 0; i < appElements.length; i++) {
	const appElement = appElements[i]
	const destinationID = appElement.getAttribute('data-destination')
	const content = appElement.textContent.trim()
	render(<App initialContent={ content } initialDestinationID={ destinationID } />, appElement)
}

//render(<App/>, document.querySelector('#app'))
