const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({
	address: process.env.HOST,
	port: (process.env.PORT || 80)
})

const landingRoutes = require('./hapi-routes/landing')
const collectedRoutes = require('./hapi-routes/collected')
const collectedFindRoutes = require('./hapi-routes/collectedFind')
const previewRoutes = require('./hapi-routes/preview')

server.route(landingRoutes)
server.route(collectedRoutes)
server.route(collectedFindRoutes)
server.route(previewRoutes)

/*server.register([
	require('hapi-auth-jwt')
], (err) => {
  server.auth.strategy('token', 'jwt', {
    key: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    verifyOptions: {
      algorithms: [ 'HS256' ],
      audience: process.env.AUTH0_CLIENT_ID
    }
  })

  server.start()
})*/

server.start()
