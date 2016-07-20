const R = require('ramda')
const escape = require('lodash/escape')

const renderMarkdown = require('../utils/renderMarkdown')


const title = 'Royal Icing · Content served like a professional'

const tagLine = `# Just add content`
const secondary = `## Build powerfully using just text, images & spreadsheets.`

const pitch = `
- Responsive web pages
- App and web wireframes
- Slide decks
- Photo and video galleries
- Interactive prototypes & micro apps

## You provide the ingredients, we take care of the rest
Recipes are a step-by-step process to transform your content into new forms.
You just have to provide the ingredients: your text, spreadsheets & imagery.
Recipes can be combined to allow small things to solve big problems.

## Organize, and then share
Group, tag, and smartly catalog your content.
You and your collaborators can then get any piece of content and combine them in new ways.
Use familiar concepts such as #hashtags to organize.

## Made for designers, but even developers will love it
Royal Icing is built on development best practices: reusability, composability, and efficient caching.
The best part is you take advantage of this automatically in an easy-to-use workflow.
`

const examples = `
## See what’s possible:

- [Product website](http://icing.space/1/preview:icing/@BurntCaramel/github:BurntCaramel/burntcaramel.com/master/Content/Lantern.icing?theme=dark)
`

const signIn = `[Sign In](/signin)`

const plans = [
	{
		title: 'Entry',
		body: `
Public publicly, 100MB storage

30 day free trial, then $6 / month

[Start using Royal Icing now](https://burntcaramel.memberful.com/checkout?plan=11870)
`
	},
	{
		title: 'Existing Customers',
		body: `

${ signIn }
`
	},
]

const renderPlan = (plan) => `
<dt>
${ escape(plan.title) }
</dt>
<dd>
<article>
${ renderMarkdown(plan.body) }
</article>
</dd>
`

const renderMapping = (render, values) => R.into('', R.map(render), values)

const homePageHTML = `
${ renderMapping(renderMarkdown, [
	tagLine,
	secondary,
	pitch,
]) }
`
/*
<nav>
<dl>
${ renderMapping(renderPlan, plans) }
</dl>
</nav>
`
*/


function renderHomePageRequest(req) {
	return {
		title,
		innerHTML: homePageHTML,
		headElements: [
		],
		theme: 'gardenWhite',
	}
}


module.exports = {
	renderHomePageRequest
}
