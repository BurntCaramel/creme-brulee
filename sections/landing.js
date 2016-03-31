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
const tagLine = `# Fast, simple webpages for your content`
const secondary = `## Royal Icing handles `

const pitch = `

- Simple webpages
- Editable press releases
- FAQs

Royal Icing takes care of web development best practices for you
and your audience:
- Fast to load, even over a cellular connection.
- Resizes and compresses images automatically.
- Responsive design from phone to desktop.
`

const signIn = `[Sign In](https://burntcaramel.memberful.com/account)`

const plans = `
## Starter
[Purchase the Starter plan](https://burntcaramel.memberful.com/checkout?plan=11870)
`

const renderHomePageMarkdown = () => [
		tagLine,
		secondary,
		pitch,
		signIn,
		plans
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
