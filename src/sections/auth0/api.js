const URL = require('url')
const axios = require('axios')

module.exports = axios.create({
	baseURL: URL.format({
		protocol: 'https',
		host: process.env.AUTH0_DOMAIN
	})
})
