const R = require('ramda')
const axios = require('axios')
const Boom = require('boom')
const { idForOrganizationAndHash } = require('./id')
const { promiseSettings } = require('./auth')
const bucketName = process.env.B2_BUCKET_NAME

const findItemContent = R.curry(({ content = true, stream = false }, { organization, sha256 }) => (
	promiseSettings()
	.then(({ authorizationToken, downloadUrl }) => {
		const id = idForOrganizationAndHash(organization, sha256)
		return axios({
			method: content ? 'get' : 'head',
			url: `${downloadUrl}/file/${bucketName}/${id}`,
			responseType: stream ? 'stream' : 'arraybuffer'
		})
	})
	.catch((error) => {
		console.log('error', error)
		throw Boom.create(error.statusCode)
	})
))

const promiseItemInfo = R.pipeP(
	findItemContent({ content: false }),
	R.pipe(
		R.path(['headers', 'content-length']),
		R.objOf('contentLength')
	)
)

const promiseStreamOfItemContent = findItemContent({ stream: true })

const promiseItemContent = findItemContent({ stream: false })

module.exports = {
	promiseItemInfo,
	promiseStreamOfItemContent,
	promiseItemContent
}
