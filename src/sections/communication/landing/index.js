const R = require('ramda')
const L = require('lodash/fp')

const renderMarkdown = require('../../../utils/renderMarkdown')


const title = 'Royal Icing · Content-first UX tools'

const tagLine = `# Your users know content is king. So why do our design & prototyping tools forget?`
//const secondary = `## Build better user experiences from the content up.`
const secondary = `## Royal Icing’s content-first approach lets you design efficiently.`

const pitch = `
Our tools help you:
- Rapidly create prototypes from content — [try demo](/flambe)
- Reuse any piece of content or layout, and update once
- Allow your design team more responsibility and control

## Treat your content like the royalty it is
- Share and reuse content between screens and projects
- Catalog your content using #hashtags
- Leverage your information architecture directly in designs
- Share any piece of content with collaborators

## Design efficiently and robustly
- Create reusable components
- Ensure edge cases are covered, such as errors & empty states

## Communicate more easily with stakeholders and developers
- Publish diagrams and reports
- Create component specs, and even React code
- Upload content to your S3, where it can be used with live code

## Action stories
- Turn your user stories into visual steps
- Highlight the interactions involved
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

30 day free trial, then $5 / month

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
${ L.escape(plan.title) }
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


function renderRequest(req) {
	return {
		title,
		innerHTML: homePageHTML,
		headElements: [
		],
		theme: 'gardenWhite',
	}
}


module.exports = {
	renderRequest
}
