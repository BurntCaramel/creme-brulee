const Express = require('express')

const landingRoute = require('./express-routes/landing')
const githubRoute = require('./express-routes/github')

const app = Express()

app.use('/', landingRoute)
app.use('/', githubRoute)

app.listen(process.env.PORT || 80)
