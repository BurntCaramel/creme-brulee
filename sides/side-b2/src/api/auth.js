const R = require('ramda')
const { resolve, reject, future } = require('creed')
const axios = require('axios')

const tapLog = R.tap(result => console.log('result', result))

class B2Auth {
	constructor(settings) {
		this.settings = settings
	}

	_resolvePendingWith(result) {
		this.pendingResolves.forEach((resolve) => resolve(result))

		delete this.pendingResolves
	}

	_authAccountIfNeeded() {
		if (!R.isNil(this.request)) {
			return
		}

		const { account, key } = this.settings

		this.pendingResolves = []

		this.request = axios.get(
			'https://api.backblazeb2.com/b2api/v1/b2_authorize_account', {
			auth: {
				username: account,
				password: key
			}
		})
		.then(R.prop('data'))
		.then(
			(result) => {
				console.log('auth', result)

				delete this.request

				this._resolvePendingWith(resolve(result))
				this._createPromise = () => resolve(result)
			},
			(error) => {
				console.log('auth error', error)

				delete this.request

				this._resolvePendingWith(reject(error))
				this._createPromise = () => reject(error)
			}
		)
	}

	then(transform) {
		if (!R.isNil(this._createPromise)) {
			console.log('Using this._createPromise')
			return this._createPromise().then(tapLog).then(transform)
		}
			
		this._authAccountIfNeeded()
		
		const { resolve, promise } = future()
		this.pendingResolves.push(resolve)

		console.log('Created pending', promise, resolve)
		return promise.then(tapLog).then(transform)
	}

	invalidate() {
		delete this._createPromise
	}
}


const requestAuthedTo = R.memoize((settings) => {
	const auth = new B2Auth(settings)

	return (makeRequestOptions) => {
		const makeRequest = () => (
			auth.then((authConfig) => (
				// Add Authorization header
				R.mergeWith(R.merge, {
					headers: { 'Authorization': authConfig.authorizationToken }
				})(makeRequestOptions(R.merge(settings, authConfig)))
			))
			.then(axios)
		)

		return makeRequest().catch(
			(error) => {
				console.error('ERROR', error)
				// If token has expired
				if (error.status === 401) {
					console.log('B2 token has expired')
					auth.invalidate()
					return makeRequest()
				}
				else {
					return reject(error)
				}
			}
		)
	}
})

module.exports = requestAuthedTo
