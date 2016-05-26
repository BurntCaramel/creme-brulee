const robotsText = `
User-agent: *
Disallow: /1
Disallow: /-imgix
`

module.exports = [
	{
		method: 'GET',
		path: `/robots.txt`,
		handler(request, reply) {
			reply(
				robotsText
			)
		}
	}
]