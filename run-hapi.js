const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({
	address: process.env.HOST,
	port: (process.env.PORT || 80)
})

const landingRoutes = require('./hapi-routes/landing')
const collectedRoutes = require('./hapi-routes/collected')

server.route(landingRoutes)
server.route(collectedRoutes)

server.start()
