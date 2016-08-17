const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({
	//address: process.env.HOST,
	port: 9010
})

server.route(require('./routes'))
	
server.start()
