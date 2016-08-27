import React from 'react'

const SignIn = React.createClass({
	render() {
		return (
			<div>
				<button children='Sign In' onClick={ this.openLock } />
			</div>
		)
	},

  openLock() {
    this.props.lock.magiclink({
      callbackURL: `https://${ location.host }/account`,
			responseType: 'token',
			authParams: {
				scope: 'openid email'  // Learn about scopes: https://auth0.com/docs/scopes
			}
    })
	}
})

export default SignIn
