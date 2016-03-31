const renderMarkdown = require('../utils/renderMarkdown')

module.exports = options => input => ({
    innerHTML: renderMarkdown(input)
})
