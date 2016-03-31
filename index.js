require('dotenv').load()

const Express = require('express')

const landingRoute = require('./routes/landing')
const githubRoute = require('./routes/github')

const app = Express()

app.use('/', landingRoute)
app.use('/', githubRoute)

app.listen(process.env.PORT || 80)
