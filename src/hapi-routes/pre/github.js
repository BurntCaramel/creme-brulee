const R = require('ramda')
const Boom = require('boom')
const axios = require('axios')
const preMethods = require('./preMethods')
const throwWhenNil = require('../../utils/throwWhenNil') 


const getRawFileURL = ({ gitHubUsername, project, branch, filePath }) => (
	`https://raw.githubusercontent.com/${gitHubUsername}/${project}/${branch}/${filePath}`
)

const promiseRawFile = R.pipe(
	R.prop('pre'),
	R.pick(['gitHubUsername', 'project', 'branch', 'filePath']),
	getRawFileURL,
	R.pipeP(
		(url) => axios.get(url),
		R.prop('data')
	)
)

module.exports = {
	promiseRawFile
}
