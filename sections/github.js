const _ = require('lodash')
const R = require('ramda')
const fetch = require('node-fetch')
const Imgix = require('imgix-core-js')

const rendererForFormat = require('../formats').rendererForFormat
const defaultTemplate = require('../templates/default')

const imgix = new Imgix({
  host: 'github-burntcaramel.imgix.net',
  secureURLToken: process.env.IMGIX_TOKEN
});

function getLocalProjectURL(user, project) {
	return `@${ user }/${ project }`;
}

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
			R.prop('query')
		]
	),
	R.mergeWith(
		R.defaultTo, // Don’t allow undefined values, e.g. for 'path'
		{ path: 'README', format: 'md', darkMode: false }
	),
	R.pick(['path', 'format', 'darkMode'])
)

const titleFromPath = R.pipe(
	R.split('/'),
	R.last
)

const rejectUndefined = R.pipe(
	R.defaultTo({}),
	R.reject(R.isNil)
)

const gitHubFileURLBuilder = (projectOptions) => (path) => {
	const result = `https://raw.githubusercontent.com/${projectOptions.username}/${projectOptions.project}/${projectOptions.branch}/${path}`
	console.log('GITHUB URL', result)
	return result
} 

const imgixURLBuilder = (projectOptions, pageOptions) => (path, options) => {
	const result = imgix.buildURL(
		`/${projectOptions.username}/${projectOptions.project}/${projectOptions.branch}/${pageOptions.path}/${path}`,
		rejectUndefined(options)
	)
	console.log('GITHUB IMAGE', result)
	return result
}

const checkStatus = R.curry((res, apiRes) => {
	const status = apiRes.status 
	res.status(status)
		
	if (status === 200) {
		return apiRes
	}
	else if (status === 404) {
		throw new Error('Not Found')
	}
	else {
		throw new Error(apiRes.statusText)
	}
})

function renderGitHubPageRequest(req, res) {
	const projectOptions = pickProjectOptions(req)
	const pageOptions = pickPageOptions(req)
	
	console.log('projectOptions', projectOptions, 'pageOptions', pageOptions)
	
	const title = (pageOptions.path === 'README') ? projectOptions.project : titleFromPath(pageOptions.path)
	
	const renderContent = rendererForFormat(pageOptions.format, {
		imgixURLForImagePath: imgixURLBuilder(projectOptions, pageOptions)
	})
	
	const gitHubFileURL = gitHubFileURLBuilder(projectOptions)
	const url = gitHubFileURL(`${pageOptions.path}.${pageOptions.format}`)
	
	R.pipeP(
		fetch,
		checkStatus(res),
		(apiRes) => apiRes.text(),
		renderContent,
		R.merge({
			title,
			originSourceURL: url,
			darkMode: pageOptions.darkMode
		}),
		defaultTemplate
	)(url).then(
		output => {
			res.send(output)
		},
		error => {
			res.send({ error: error.message, stack: error.stack })
		}
	)
}



const renderUsername = username => `# ${ username }`

const renderRepos = R.map(repo => `## [${ repo.name }](@${ repo.full_name })`)

const renderProfileMarkdown = R.converge(
	R.unapply(R.pipe(
		R.flatten,
		R.join('\n')
	)), [
		R.pipe(
			R.path(['userOptions', 'username']),
			renderUsername
		),
		R.pipe(
			R.prop('repos'),
			R.filter(R.whereEq({ fork: false })),
			renderRepos
		),
	]
)

const pickUserOptions = R.pipe(
	R.prop('params'),
	R.pick(['username'])
)

function renderGitHubProfileRequest(req, res) {
	const userOptions = pickUserOptions(req)
	
	const renderMarkdown = rendererForFormat('md', {
		imgixURLForImagePath : null
	})
	
	const gitHubProfileURL = `https://api.github.com/users/${userOptions.username}/repos`
	fetch(gitHubProfileURL)
	.then(apiRes => {
		console.log('status', apiRes.status);
		res.status(apiRes.status)
		
		if (apiRes.status === 200) {
			return apiRes.json()
		}
		else if (apiRes.status === 404) {
			throw new Error('Not Found')
		}
		else {
			throw new Error(apiRes.statusText)
		}
	})
	.then(repos => {
		console.log('repos', repos.length);
		return repos
	})
	.then(repos => renderMarkdown(renderProfileMarkdown({ userOptions, repos })))
	.then(
		output => {
			res.send(defaultTemplate(Object.assign(
				{
					title: userOptions.username
				},
				output
			)))
		},
		error => {
			res.send({ error: error.message, stack: error.stack })
		}
	)
}

exports.renderGitHubPageRequest = renderGitHubPageRequest
exports.renderGitHubProfileRequest = renderGitHubProfileRequest