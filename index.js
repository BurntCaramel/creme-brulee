require('dotenv').load()
const Express = require('express')

const github = require('./github')
const renderGitHubPageRequest = github.renderGitHubPageRequest
const renderGitHubProfileRequest = github.renderGitHubProfileRequest

const app = Express()

const route = Express.Router()

route.get('/@:username/:project', renderGitHubPageRequest)
route.get('/@:username/:project/*', renderGitHubPageRequest)

route.get('/@:username', renderGitHubProfileRequest)

app.use('/', route)

app.listen(process.env.PORT || 80)
