const Hapi = require('hapi')
const Boom = require('boom')
const Path = require('path')

const routes = require('./hapi-routes')

if (process.env.NODE_ENV === 'development') {
	process.on('uncaughtException', (error) => {
		console.error(`Caught exception`, error)
	})
}

const server = new Hapi.Server()
server.connection({
	address: process.env.HOST,
	port: (process.env.PORT || 80),
	routes: {
		files: {
			relativeTo: Path.resolve(__dirname, '..', 'web')
		}
	}
})

// Cookies
require('./state')(server)

server.register([
	require('hapi-auth-jwt'),
	require('inert')
], (err) => {
	if (err) {
		throw err
	}

  server.auth.strategy('auth0token', 'jwt', {
    key: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    verifyOptions: {
      algorithms: [ 'HS256' ],
      audience: process.env.AUTH0_CLIENT_ID
    }
  })

	server.auth.strategy('organizationToken', 'jwt', {
    key: new Buffer(process.env.ROYAL_ICING_CLIENT_SECRET, 'base64'),
    verifyOptions: {
      algorithms: [ 'HS256' ]//,
			//audience: 'icing.space'
    },
		validateFunc({ params }, credentials, done) {
			if ((params.organizationName || params.organization) != credentials.organizationName) {
				return done(Boom.unauthorized(`Token is not authorized for organization`, 'Bearer'), false)
			}

			return done(null, true, credentials)
		}
  })

	server.route(routes)
	
  server.start()
})
