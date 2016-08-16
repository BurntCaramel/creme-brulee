const { promiseSettings } = require('./api/auth')

module.exports = [
    {
        method: 'GET',
        path: '/status',
        handler(request, reply) {
            reply(promiseSettings())
        }
    }    
]