const Remarkable = require('remarkable')

const md = new Remarkable()

module.exports = options => input => ({
    innerHTML: md.render(input)
})
