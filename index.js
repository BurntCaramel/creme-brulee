require('dotenv').config(process.env.NOW ? { path:'./envnow', silent: true } : { path:'./.env', silent: true })

require('./src')
