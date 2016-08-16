module.exports = [
	{
		method: 'GET',
		path: '/flambe',
		//path: '/flambe/{fileName}',
		handler(request, reply) {
			reply.file(`flambe/dist/index.html`)
		}
	},
	{
		method: 'GET',
		path: '/1/-web/flambe/{fileName}',
		//path: '/flambe/{fileName}',
		handler(request, reply) {
			reply.file(`flambe/dist/${request.params.fileName}`)
		}
	}
]