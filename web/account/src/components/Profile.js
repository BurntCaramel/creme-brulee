import React from 'react'

export default function({ profile }) {
	return (
		<div>
			<h2>{ profile.user_id }</h2>
			{ profile.picture &&
				<img
					src={ profile.picture }
					style={{ display: 'block' }}
				/>
			}
		</div>
	)
}
