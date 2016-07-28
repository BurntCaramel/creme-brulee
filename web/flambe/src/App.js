import React from 'react'
import Main from './Main'

const initialContent = (
`User name #field
Password #field

Sign In #button @signIn
Forgot Your Password? #button @showForgotPassword

@legal
`)

const source = {
	'@legal': `Copyright Company Inc. 2016`
}

export default React.createClass({
  render() {
    return (
			<Main initialContent={ initialContent } sourceProps={ source } />
		)
  }
})
