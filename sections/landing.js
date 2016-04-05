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

const title = 'Royal Icing'

//const tagLine = `# Boldly simple webpages for your content`
//const tagLine = `# Boldy simple web pages that let you communicate`
//const tagLine = `# For boldy simple communication`
//const tagLine = `# Fearlessly simple web pages`
const tagLine = `# For communicators who just want something simple`
const secondary = `## Create fast, elegant websites`

const pitch = `
Royal Icing is great for:

- Boldy simple web pages
- Photo galleries
- Editable press releases
- FAQs

Royal Icing takes care of web best practices for you:

- Fast to load, even over a cellular connection.
- Resizes and optimizes images for your users’ devices automatically.
- Responsive design with legible typography from phone to desktop.

## See what’s possible:

- [Product website](http://github.icing.space/@BurntCaramel/burntcaramel.com/Content/Lantern?format=icing&theme=dark)
- [Photo gallery](http://github.icing.space/@BurntCaramel/burntcaramel.com/Content/Photography?format=icing&theme=dark)
`

const signIn = `[Sign In](https://burntcaramel.memberful.com/account)`

const plans = [
	{
		title: 'Get Started',
		body: `
1 custom domain, automatically optimized images, Markdown

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
<nav>
<dl>
${ renderMapping(renderPlan, plans) }
</dl>
</nav>
`


function renderHomePageRequest(req) {
	return {
		title,
		innerHTML: homePageHTML,
		headElements: [
			memberfulScript
		],
		theme: 'bluePrint',
	}
}


module.exports = {
	renderHomePageRequest
}
