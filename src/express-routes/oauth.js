const Express = require('express')

const landing = require('../services/landing')
const routeRendering = require('../utils/routeRendering')

const route = Express.Router()

route.get('/auth', routeRendering(collected.serveFileRequest))
route.post('/redirect', routeRendering(collected.uploadFileRequest))

module.exports = route
