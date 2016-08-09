const R = require('ramda')
const axios = require('axios')

let state = {}

const clearStateAfterLoad = () => {
	delete state.pendingResolves
	delete state.pendingRejects
	delete state.request
}

const requestSettings = () => {
	state.request = axios.get(
		'https://api.backblaze.com/b2api/v1/b2_authorize_account', {
		auth: {
			username: process.env.B2_ACCOUNT,
			password: process.env.B2_KEY
		}
	})
	.then(R.prop('data'))
	.then(
		(result) => {
			state.pendingResolves.forEach((resolve) => {
				resolve(result)
			})
			
			clearStateAfterLoad()
			
			state.createPromise = () => Promise.resolve(result)
		},
		(error) => {
			state.pendingRejects.forEach((reject) => {
				reject(error)
			})
			
			clearStateAfterLoad()
			
			state.createPromise = () => Promise.reject(error)
		}
	)
}

const promiseSettings = () => {
	if (!R.isNil(state.createPromise)) {
		return state.createPromise()
	}
	
	if (R.isNil(state.request)) {
		state.pendingResolves = []
		state.pendingRejects = []
		
		requestSettings()
	}
	
	return new Promise((resolve, reject) => {
		state.pendingResolves.push(resolve)
		state.pendingRejects.push(reject)
	})
}

const promiseAuthorizationToken = R.pipe(
	promiseSettings,
	R.prop('authorizationToken')
)

const invalidateSettings = () => {
	delete state.createPromise
}

module.exports = {
	promiseSettings,
	promiseAuthorizationToken,
	invalidateSettings
}
