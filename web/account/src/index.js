import './index.css'

import React from 'react'
import { render } from 'react-dom'

import App from './App'
import { isTokenExpired } from './jwtHelper'

const lock = new Auth0LockPasswordless(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, {
	callbackOnLocationHash: true
})

function renderApp(props) {
	render(
		<App
			lock={ lock }
			{ ...props }
		/>,
		document.querySelector('#app')
	)
}

function useToken(idToken) {
	localStorage.setItem('idToken', idToken)
	renderApp({ signedIn: true })

	lock.getProfile(idToken, (error, userProfile) => {
		renderApp(error ? {
			signedIn: true,
			userProfile: null,
			userProfileError: error
		} : {
			signedIn: true,
			userProfile,
			userProfileError: null
		})
	})
}

const authResult = lock.parseHash(window.location.hash)
if (authResult && authResult.id_token) {
	useToken(authResult.id_token)
}
else {
	const idToken = localStorage.getItem('idToken')
	const expired = isTokenExpired(idToken)
	if (expired) {
		localStorage.removeItem('idToken')
		renderApp({ signedIn: false })
	}
	else {
		useToken(idToken)
	}
}
