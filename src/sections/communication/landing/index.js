const R = require('ramda')
const escape = require('lodash/escape')

const renderMarkdown = require('../../../utils/renderMarkdown')


const title = 'Royal Icing · Professional UX tools'

const tagLine = `# Your users know content is king. So why do our design & prototyping tools forget?`
//const secondary = `## Build better user experiences from the content up.`
const secondary = `## Build better user experiences by designing content-first.`

const pitch = `
Our tools help you:
- Rapidly create interactive prototypes from content — [try demo](/flambe)
- Create more in-depth user experiences by letting your design team have more control
- Allow your design team to communicate more easily, both with stakeholders and developers
- Use reusable components in your design workflow
- Share and reuse content between projects
- Ensure your designs cover more edge cases

## Treat your content like the royalty it is
- Design making use of your information architecture

## Prototypes that communicate
- Rapid prototyping as easy as writing Markdown
- Create action stories: the visual steps of a user story
- Publish diagrams and reports to assist communicating with stakeholders
- Share the responsibility of naming, one of the hardest things of programming, with the design team 

## Catalog and share your content
- Group and tag your content: use #hashtags to organize
- Autmatically share any piece of content with collaborators
- Combine content in new ways

## Complement existing workflows
Our tools are designed to enhance by letting you rapidly improve your content, help battle test layouts, and keep everything organized so no details are lost.
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
