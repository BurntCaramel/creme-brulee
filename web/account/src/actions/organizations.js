import fetchJSON from './fetchJSON'

export function createOrganization({ token, organizationName, ownerEmail }) {
	return fetchJSON(`/1/@${organizationName}`, {
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${token}`
		},
		body: {
			ownerEmail
		}
	})
}

export function listOrganizations({ token }) {
	return fetchJSON(`/1/@`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${token}`
		}
	})
	.map(({ items }) => (items))
}

export function listTagsInOrganization({ token, organizationName }) {
	return fetchJSON(`/1/@${organizationName}/tags/search`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`
		}
	})
	.map(({ items }) => (items))
}
