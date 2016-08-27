import { resolve } from 'creed'

export default function fetchJSON(url, options) {
	return resolve(fetch(url, Object.assign({}, options, {
		headers: Object.assign({
			'Accept': 'application/json',
      'Content-Type': 'application/json'
		}, options.headers),
		body: (options.body && JSON.stringify(options.body)) || null
	})))
	.chain(r => r.json())
}
