module.exports = [
	{
		method: 'GET',
		path: '/1/-web/slides/{fileName}',
		handler(request, reply) {
			reply.file(`slides/dist/${request.params.fileName}`)
		}
	}
]