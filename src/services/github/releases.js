const R = require('ramda')

const renderMarkdownToHTML = require('../../utils/renderMarkdown')
const fetchValidJSON = require('../../utils/fetch').fetchValidJSON

const renderTitleMarkdown = (username, project) => `# ${ username } / ${ project }`

const renderReleaseHTML = release =>
`
<dt>
${release.tag_name}: ${release.name}
</dt>
<dd>
<article>
${ renderMarkdownToHTML(release.body) }
</article>
</dd>
`

const renderReleasesHTML = R.converge(
	R.unapply(R.pipe(
		R.flatten,
		R.join('\n\n')
	)), [
		R.pipe(
			R.props(['username', 'project']),
			R.apply(renderTitleMarkdown),
			renderMarkdownToHTML
		),
		R.pipe(
			R.prop('releases'),
			R.reject(R.propEq('draft', true)),
			R.map(renderReleaseHTML),
			R.join('\n\n'),
			(html) => `<dl>${ html }</dl>`
		),
	]
)

function fetchAndRenderReleases(projectOptions) {
	const username = projectOptions.username
	const project = projectOptions.project
	
	return fetchValidJSON(`https://api.github.com/repos/${username}/${project}/releases`)
		.then(R.pipe(
			(releases) => renderReleasesHTML({ username, project, releases }),
			R.objOf('innerHTML'),
			R.merge({
				title: `${username} / ${project}`,
			})
		))
}

const pickProjectOptions = R.pipe(
	R.prop('params'),
	R.pick(['username', 'project'])
)

const renderReleasesRequest = R.converge(
	fetchAndRenderReleases, [
		pickProjectOptions
	]
)


module.exports = {
	fetchAndRenderReleases,
	renderReleasesRequest
}
