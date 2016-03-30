require('dotenv').load()

const Express = require('express')

const githubRoute = require('./routes/github')

const app = Express()

app.use('/', githubRoute)

app.listen(process.env.PORT || 80)
