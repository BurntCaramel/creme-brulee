import React from 'react'
import { render } from 'react-dom'

import App from './App'

const appElements = document.querySelectorAll('.flambe-app')
for (var i = 0; i < appElements.length; i++) {
	const appElement = appElements[i]
	const destinationID = appElement.getAttribute('data-destination')
	const contentElement = appElement.querySelector('.flambe-app-content')
	const ingredientsElement = appElement.querySelector('.flambe-app-ingredients')
	const scenariosElement = appElement.querySelector('.flambe-app-scenarios')
	const content = contentElement.textContent.trim()
	const ingredients = ingredientsElement ? (
		JSON.parse(ingredientsElement.textContent)
	) : []
	const scenarios = scenariosElement ? (
		JSON.parse(scenariosElement.textContent)
	) : []
	render(
		<App
			initialContent={ content }
			initialDestinationID={ destinationID }
			initialIngredients={ ingredients }
			initialScenarios={ scenarios }
		/>,
		appElement
	)
}

//render(<App/>, document.querySelector('#app'))
