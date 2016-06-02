const Express = require('express')

const github = require('../services/github')
const routeRendering = require('../utils/routeRendering')

const route = Express.Router()

// http://github.icing.space/@BurntCaramel/burntcaramel.com/983498a39898f9a8f98a.collected
route.get('/@:username/:project/:commit', routeRendering(github.renderCollectedIndexRequest))
route.get('/@:username/:project/:commit/*', routeRendering(github.renderCollectedFileRequest))

//route.get('/@:username/:project', routeRendering(github.renderReleasesRequest))
//route.get('/@:username/:project/*', routeRendering(github.renderPageRequest))

route.get('/@:username', routeRendering(github.renderUserReposRequest))

module.exports = route