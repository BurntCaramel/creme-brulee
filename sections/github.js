const R = require('ramda')
const fetch = require('node-fetch')
const Imgix = require('imgix-core-js')

const rendererForFormat = require('../formats').rendererForFormat
const defaultTemplate = require('../templates/default')
const fetchUtils = require('../utils/fetch')
const fetchValidJSON = fetchUtils.fetchValidJSON
const fetchValidText = fetchUtils.fetchValidText
const routeRendering = require('../utils/routeRendering')

const imgix = new Imgix({
  host: 'github-burntcaramel.imgix.net',
  secureURLToken: process.env.IMGIX_TOKEN
})

const pickProjectOptions = R.pipe(
	R.prop('params'),
	R.merge({ branch: 'master' }),
	R.pick(['username', 'project', 'branch'])
)

const pickPageOptions = R.pipe( 
	R.converge(
		R.unapply(R.mergeAll), [
			R.pipe(
				R.path(['params', 0]),
				R.objOf('path')
			),
			R.prop('query'),
			R.pipe(
				R.pathSatisfies(Boolean, ['query', 'darkMode']),
				R.objOf('darkMode')
			),
		]
	),
	R.mergeWith(
		R.defaultTo, // Don’t allow undefined values, e.g. for 'path'
		{ path: 'README', format: 'md', darkMode: false }
	),
	R.pick(['path', 'format', 'darkMode'])
)

const pickImgixOptions = R.pipe( 
	R.converge(
		R.unapply(R.mergeAll), [
			R.pipe(
				R.path(['query', 'primaryColor']),
				R.objOf('mono')
			),
		]
	),
	R.pick(['blend', 'mono'])
)

const titleFromPath = R.pipe(
	R.split('/'),
	R.last
)

const getGitHubFileURL = (projectOptions, pageOptions) => (
	`https://raw.githubusercontent.com/${projectOptions.username}/${projectOptions.project}/${projectOptions.branch}/${pageOptions.path}.${pageOptions.format}`
)

const cleanOptions = R.reject(R.isNil)

const imgixURLBuilder = (projectOptions, pageOptions, imgixOptions) => (path, options) => (
	imgix.buildURL(
		`/${projectOptions.username}/${projectOptions.project}/${projectOptions.branch}/${pageOptions.path}/${path}`,
		cleanOptions(R.mergeAll([{}, imgixOptions, options]))
	)
)

function renderPage(projectOptions, pageOptions, imgixOptions) {
	console.log('projectOptions', projectOptions, 'pageOptions', pageOptions)
	
	const title = (pageOptions.path === 'README') ? projectOptions.project : titleFromPath(pageOptions.path)
	
	const renderContent = rendererForFormat(pageOptions.format, {
		imgixURLForImagePath: imgixURLBuilder(projectOptions, pageOptions, imgixOptions)
	})
	
	const url = getGitHubFileURL(projectOptions, pageOptions)
	
	return fetchValidText(url).then(R.pipe(
		renderContent,
		R.merge({
			title,
			originSourceURL: url,
			darkMode: pageOptions.darkMode
		})
	))
}

const renderPageRequest = R.converge(
	renderPage, [
		pickProjectOptions,
		pickPageOptions,
		pickImgixOptions
	]
)


const renderUsername = username => `# ${ username }`

const renderRepos = R.map(repo => `## [${ repo.name }](@${ repo.full_name })`)

const renderProfileMarkdown = R.converge(
	R.unapply(R.pipe(
		R.flatten,
		R.join('\n')
	)), [
		R.pipe(
			R.prop('username'),
			renderUsername
		),
		R.pipe(
			R.prop('repos'),
			R.filter(R.whereEq({ fork: false })),
			renderRepos
		),
	]
)

const renderMarkdownToHTML = rendererForFormat('md', {})

function renderUserRepos(userOptions) {
	const username = userOptions.username;
	
	return fetchValidJSON(`https://api.github.com/users/${username}/repos`)
		.then(R.pipe(
			(repos) => renderProfileMarkdown({ username, repos }),
			renderMarkdownToHTML,
			R.merge({
				title: username,
			})
		))
}

const pickUserOptions = R.pipe(
	R.prop('params'),
	R.pick(['username'])
)

const renderUserReposRequest = R.converge(
	renderUserRepos, [
		pickUserOptions
	]
)



module.exports = {
	renderPageRequest,
	renderUserReposRequest,
}
