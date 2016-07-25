const renderMarkdown = require('../../../utils/renderMarkdown')

const bodyMarkdown = `
# Benefits
---

## Create powerful things just using content

## Use one source of content to produce multiple things

## Collaborate and share content within a team

## Build without coding

## Stay organized
`

const title = 'Royal Icing · Benefits'

const bodyHTML = renderMarkdown(bodyMarkdown)

module.exports = (req) => ({
	title,
	innerHTML: bodyHTML,
	theme: 'gardenWhite'
})

// ### Micro-content