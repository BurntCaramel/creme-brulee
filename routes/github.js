const Express = require('express')

const github = require('../sections/github')

const route = Express.Router()

route.get('/@:username/:project', github.renderGitHubPageRequest)
route.get('/@:username/:project/*', github.renderGitHubPageRequest)

route.get('/@:username', github.renderGitHubProfileRequest)

module.exports = route