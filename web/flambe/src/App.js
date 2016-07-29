import React from 'react'
import Main from './Main'

const initialContent = (
`Welcome to Royal Icing #heading

#video

User name #field
Password #field

Sign In #button #primary
Forgot Your Password? #button #small

About Me #link: https://icing.space/about

@legal
`)

const source = [
	{
		id: 'legal',
		content: `Copyright Company Inc. 2016`
	}
]

export default React.createClass({
  render() {
    return (
			<Main initialContent={ initialContent } initialIngredients={ source } />
		)
  }
})
