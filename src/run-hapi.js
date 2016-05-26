const Hapi = require('hapi')

const routes = require('./hapi-routes')

if (process.env.NODE_ENV === 'development') {
	process.on('uncaughtException', (error) => {
		console.error(`Caught exception`, error)
	})
}

const server = new Hapi.Server()
server.connection({
	address: process.env.HOST,
	port: (process.env.PORT || 80)
})

server.register([
	require('hapi-auth-jwt')
], (err) => {
  server.auth.strategy('token', 'jwt', {
    key: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    verifyOptions: {
      algorithms: [ 'HS256' ],
      audience: process.env.AUTH0_CLIENT_ID
    }
  })

	server.route(routes)
	
  server.start()
})
