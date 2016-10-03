import React from 'react'

function LogOut({ onLogOut }) {
	return (
		<div>
			<button children='Log Out' onClick={ onLogOut } />
		</div>
	)
}

export default LogOut
