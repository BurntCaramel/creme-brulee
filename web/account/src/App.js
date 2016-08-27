import './App.css'

import React from 'react'
import { resolve } from 'creed'

import SignIn from './components/SignIn'
import Profile from './components/Profile'
import OrganizationList from './components/organizations/OrganizationList'

import actions from './actions'

const App = React.createClass({
	getDefaultProps() {
		return {
			signedIn: false,
			userProfile: null,
			userProfileError: null
		}
	},

	getInitialState() {
		return Object.assign({
			organizations: null,
			organizationsTags: null,
			errors: {}
		})
	},

	runAction(key, actionID, payload) {
		const promise = resolve(actions[key][actionID](payload))
		this.storePromise(key, promise)
	},

	storePromise(key, promise) {
		promise.then(
			(result) => {
				this.setState({
					[key]: result
				})

				this.actionDidComplete(key, result)
			},
			(error) => {
				this.setState(({ errors }) => ({
					errors: Object.assign(errors, {
						[key]: error
					})
				}))
			}
		)
	},

	actionDidComplete(key, result) {
	},

	componentWillReceiveProps(nextProps) {
		const previousProps = this.props
		if (!!nextProps.token && nextProps.token !== previousProps.token) {
			this.runAction('organizations', 'listOrganizations', { token: nextProps.token })
		}
	},

  render() {
		const {
			token,
			lock,
			signedIn,
			userProfile,
			userProfileError
		} = this.props

		const {
			organizations
		} = this.state

    return (
			<div className="App">
			{
				(signedIn) ? (
					<div>
						{ (userProfile) ? (
							<Profile profile={ userProfile } />
						) : (
							<div>Loading profile…</div>
						) }
						{ (organizations) ? (
							<OrganizationList organizations={ organizations } token={ token } /> 
						) : (
							<div>Loading organizations…</div>
						) }
					</div>
				) : (
					<SignIn lock={ lock } />
				)
			}
			</div>
		)
  }
})

export default App
