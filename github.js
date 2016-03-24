const _ = require('lodash')
const R = require('ramda')
const fetch = require('node-fetch')
const Imgix = require('imgix-core-js')

const formatToRenderers_options = require('./formats')
const defaultTemplate = require('./templates/default')

const imgix = new Imgix({
  host: 'github-burntcaramel.imgix.net',
  secureURLToken: process.env.IMGIX_TOKEN
});

function getLocalProjectURL(user, project) {
	return `@${ user }/${ project }`;
}

function renderGitHubPageRequest(req, res) {
	const projectOptions = _.pick(
		_.defaults({}, req.params, { branch: 'master' }),
		['username', 'project', 'branch']
	)
	
	const pageOptions = _.pick(
		_.defaults({}, { path: req.params[0] }, req.query, { path: 'README', format: 'md' }),
		['path', 'format']
	)
	
	const title = (pageOptions.path === 'README') ? (
		projectOptions.project
	) : (
		_.last(pageOptions.path.split('/'))
	)
	
	function gitHubFileURL(path) {
		const result = `https://raw.githubusercontent.com/${projectOptions.username}/${projectOptions.project}/${projectOptions.branch}/${path}`
		console.log('GITHUB URL', result)
		return result
	}
	
	function imgixURLForImagePath(path, options) {
		options = _.omit(
			(options || {}),
			_.isUndefined
		)
		
		const result = imgix.buildURL(`/${projectOptions.username}/${projectOptions.project}/${projectOptions.branch}/${pageOptions.path}/${path}`, options)
		console.log('GITHUB IMAGE', result)
		return result
	}
	
	const formatToRenderers = formatToRenderers_options({
		imgixURLForImagePath
	})
	
	fetch(gitHubFileURL(`${pageOptions.path}.${pageOptions.format}`))
	.then(gRes => {
		res.status(gRes.status)
		
		if (gRes.status === 200) {
			return gRes.text()
		}
		else if (gRes.status === 404) {
			throw new Error('Not Found')
		}
		else {
			throw new Error(gRes.statusText)
		}
	})
	.then(
		_.get(formatToRenderers, [pageOptions.format], formatToRenderers.plain)
	)
	.then(
		output => {
			res.send(defaultTemplate(Object.assign({ title }, output)))
		},
		error => {
			res.send({ error: error.message, stack: error.stack })
		}
	)
}

const renderUsername = username => `# ${ username }`

const renderRepos = R.map(repo => `
## [${ repo.name }](@${ repo.full_name })
`)

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

const pickUserOptions = R.pick(['username'])

function renderGitHubProfileRequest(req, res) {
	const userOptions = pickUserOptions(req.params)
	
	function imgixURLForImagePath(path, options) {
		options = _.omit(
			(options || {}),
			_.isUndefined
		)
		
		return imgix.buildURL(`/${projectOptions.username}/${path}`, options)
	}
	
	const formatToRenderers = formatToRenderers_options({
		imgixURLForImagePath
	})
	
	const gitHubProfileURL = `https://api.github.com/users/${userOptions.username}/repos`
	fetch(gitHubProfileURL)
	.then(gRes => {
		console.log('status', gRes.status);
		res.status(gRes.status)
		
		if (gRes.status === 200) {
			return gRes.json()
		}
		else if (gRes.status === 404) {
			throw new Error('Not Found')
		}
		else {
			throw new Error(gRes.statusText)
		}
	})
	.then(repos => {
		console.log('repos', repos.length);
		return repos
	})
	.then(repos => formatToRenderers.md(renderProfileMarkdown({ userOptions, repos })))
	.then(
		output => {
			res.send(defaultTemplate(Object.assign({ title: userOptions.username }, output)))
		},
		error => {
			res.send({ error: error.message, stack: error.stack })
		}
	)
}

exports.renderGitHubPageRequest = renderGitHubPageRequest
exports.renderGitHubProfileRequest = renderGitHubProfileRequest