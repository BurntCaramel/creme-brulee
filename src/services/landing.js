const R = require('ramda')
const escape = require('lodash/escape')

const renderMarkdown = require('../utils/renderMarkdown')

const memberfulScript =
`<script type="text/javascript">
  window.MemberfulOptions = {site: "https://burntcaramel.memberful.com"};

  (function() {
    var s   = document.createElement('script');

    s.type  = 'text/javascript';
    s.async = true;
    s.src   = 'https://d35xxde4fgg0cx.cloudfront.net/assets/embedded.js';

    setup = function() { window.MemberfulEmbedded.setup(); }

    if(s.addEventListener) { s.addEventListener("load", setup, false); } else { s.attachEvent("onload", setup); }

    ( document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] ).appendChild( s );
  })();
</script>`

const title = 'Royal Icing · Content served like a professional'

const tagLine = `# Create like a developer: just add content`
// const tagLine = `# Content is king, so we built it a palace`
const secondary = `## Build rapidly using just text, images & spreadsheets.`

const pitch = `
Royal Icing lets you get closer to what a developer makes. All you need is your content.

- Responsive web pages
- App and website wireframes
- Slide decks
- Photo and video galleries

## Professional recipes
Recipes allow transforming your content into new forms.
You just have to provide the ingredients: your text, spreadsheets & imagery.
You can combine recipes to create ever more powerfully.

## Even designers and developers will love it
Royal Icing is built on development best practices: reusability, composability, and efficient caching.
The best part is you automatically take advantage of this in an easy-to-use workflow.

## Organize and share
Collections allow your content to be easily grouped together and cataloged.
You and your collaborators can then reuse any piece of content and combine them in new ways.
Use familiar concepts such as #hashtags to organize.

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
			memberfulScript
		],
		theme: 'gardenWhite',
	}
}


module.exports = {
	renderHomePageRequest
}
