module.exports = [
	{
		method: 'GET',
		path: '/signin',
		handler(request, reply) {
			reply.file(`account/dist/index.html`)
		}
	},
	{
		method: 'GET',
		path: '/account',
		handler(request, reply) {
			reply.file(`account/dist/index.html`)
		}
	},
	{
		method: 'GET',
		path: '/-web/account/{fileName}',
		handler({ params: { fileName } }, reply) {
			reply.file(`account/dist/${fileName}`)
		}
	},
	{
		method: 'GET',
		path: '/auth0',
		handler({ query: { code }, info: { host } }, reply) {
			// TODO
			const session = ''

			reply
				.state('auth-session', session)
				.redirect(`https://${ host }/account`)
		}
	}
]