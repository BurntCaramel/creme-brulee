const escape = require('lodash/escape')

module.exports = options => input => ({
    innerHTML: escape(input)
})