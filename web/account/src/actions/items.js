import fetchJSON from './fetchJSON'

export function findItemsWithTags({ token, organizationName, tags }) {
	return fetchJSON(`/1/@${organizationName}/search:tags`, {
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${token}`
		},
		body: {
			tags
		}
	})
	.map(({ items }) => (items))
}
