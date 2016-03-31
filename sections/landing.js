const R = require('ramda')

const rendererForFormat = require('../formats').rendererForFormat
const renderMarkdownToHTML = rendererForFormat('md', {})

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
const tagLine = `# Fast, simple web pages for your content`
const secondary = `## Royal Icing lets you handle text and images with aplomb`

const pitch = `

- Simple web pages
- Photo galleries
- Editable press releases
- FAQs

Royal Icing takes care of web best practices for you
and your audience:
- Fast to load, even over a cellular connection.
- Resizes and optimizes images automatically.
- Responsive design from phone to desktop.
`

const signIn = `[Sign In](https://burntcaramel.memberful.com/account)`

const plans = `
## Starter plan

1 custom domain · optimized images · Markdown

### 30 day free trial, then $8 / month
 
[Purchase the Starter plan](https://burntcaramel.memberful.com/checkout?plan=11870)
`

const renderHomePageMarkdown = () => [
		tagLine,
		secondary,
		pitch,
		plans,
		signIn
	].join('\n')

const renderHomePage = R.pipe(
	renderHomePageMarkdown,
	renderMarkdownToHTML,
	R.merge({
		title,
		headElements: [
			memberfulScript
		],
		//darkMode: true,
	})
)


function renderHomePageRequest(req) {
	return renderHomePage()
}


module.exports = {
	renderHomePageRequest
}
