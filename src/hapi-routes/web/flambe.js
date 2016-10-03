module.exports = [
	{
		method: 'GET',
		path: '/flambe',
		handler(request, reply) {
			reply.file(`flambe/dist/index.html`)
		}
	},
	{
		method: 'GET',
		path: '/-web/flambe/{fileName}',
		handler({ params: { fileName } }, reply) {
			reply.file(`flambe/dist/${fileName}`)
		}
	}
]