const Express = require('express')

const landing = require('../sections/landing')

const route = Express.Router()

route.get('/', landing.renderHomePage)

module.exports = route