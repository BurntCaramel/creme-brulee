const Express = require('express')

const landing = require('../sections/landing')
const routeRendering = require('../utils/routeRendering')

const route = Express.Router()

route.get('/', routeRendering(landing.renderHomePageRequest))

module.exports = route