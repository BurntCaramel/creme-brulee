import './App.css'

import React from 'react'

import LoginButton from './components/LoginButton'
import Profile from './components/Profile'

const App = React.createClass({
	getDefaultProps() {
		return {
			signedIn: false,
			userProfile: null,
			userProfileError: null
		}
	},

  render() {
		const {
			lock,
			signedIn,
			userProfile,
			userProfileError
		} = this.props

    return (
			<div className="App">
			{
				(signedIn) ? (
					(userProfile) ? (
						<Profile profile={ userProfile } />
					) : (
						'Loading profile…'
					)
				) : (
					<LoginButton lock={ lock } />
				)
			}
			</div>
		)
  }
})

export default App
