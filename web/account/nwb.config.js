require('dotenv').config({ path:'../../.env', silent: true })

module.exports = {
  type: 'react-app',
	webpack: {
		publicPath: '/-web/account',
		define: {
			__AUTH0_CLIENT_ID__: JSON.stringify(process.env.AUTH0_CLIENT_ID),
			__AUTH0_DOMAIN__: JSON.stringify(process.env.AUTH0_DOMAIN)
		}
	}
}
