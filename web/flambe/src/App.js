import React from 'react'
import Main from './Main'

const initialContent = (
`Welcome to Royal Icing #primary

Create using just text and hashtags #image #unsplash: dessert

User name #field
Password #field

Sign In #button #primary
Forgot Your Password? #button #small

Features #link: https://icing.space/features

@legal #small
`)

/*
	# shorthand #primary
	## shorthand #secondary
	### shorthand #tertiary

	#collected:(hash)
*/

const source = [
	{
		id: 'legal',
		type: 'text',
		rawContent: `Copyright Company Inc. 2016`
	}
]

export default React.createClass({
  render() {
    return (
			<Main initialContent={ initialContent } initialIngredients={ source } />
		)
  }
})
