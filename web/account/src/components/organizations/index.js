import React from 'react'

import OrganizationList from './components/OrganizationList'

export default function Organizations({
	organizations,
	onCreateOrganization
}) {
	return (
		<div>
			<OrganizationList organizations={ organizations } />
			<button children='Create Organization' onClick={ onCreateOrganization } />
		</div>
	)
}
