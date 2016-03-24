const _ = require('lodash')

module.exports = options => input => ({
    innerHTML: _.escape(input)
})