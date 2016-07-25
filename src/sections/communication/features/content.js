const renderMarkdown = require('../../../utils/renderMarkdown')

const bodyMarkdown = `
# Features
---

## Content

Royal Icing allows working with text, images, records, and spreadsheets.

### Text

Text can range from short copy, such as ‘Like’ and ‘Sign Up’,
to longer text, such as Markdown documents.

### Images

Royal Icing supports JPEGs, GIFs, PNGs.

It uses the Imgix service to scale images on the fly,
meaning you just upload an image at a single size,
and it will be resized to whatever dimensions and resolutions you need.

### Records and Spreadsheets

Popular in the world of APIs and business,
Royal Icing supports records and multiple records in spreadsheets.

The preferred formats are JSON and CSV,
which are open allowing you to use them anywhere.

Royal Icing allows transforming records and spreadsheets into other forms.
This mean you can quickly go from having a list of names to a website or
interactive prototype.

## Organization

Flexible yet easy-to-use tools are provided to organize your content:

- Create catalogs to group multiple items together, and share them with others
- Use #hashtags to organize items and find them later
`

const title = 'Royal Icing · Features'

const bodyHTML = renderMarkdown(bodyMarkdown)

module.exports = (req) => ({
	title,
	innerHTML: bodyHTML,
	theme: 'gardenWhite'
})

// ### Micro-content