const Express = require('express')

const github = require('../sections/github')
const routeRendering = require('../utils/routeRendering')

const route = Express.Router()

route.get('/@:username/:project', routeRendering(github.renderPageRequest))
route.get('/@:username/:project/*', routeRendering(github.renderPageRequest))

route.get('/@:username', routeRendering(github.renderUserReposRequest))

module.exports = route