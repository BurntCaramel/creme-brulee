const Remarkable = require('remarkable')

const md = new Remarkable()

const renderMarkdown = (input) => md.render(input) 

module.exports = renderMarkdown 
