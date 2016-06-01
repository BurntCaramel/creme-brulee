module.exports = (createPromise) => (request, reply) => {
	reply(createPromise(request))
}