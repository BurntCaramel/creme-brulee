const R = require('ramda')
const axios = require('axios')
const Boom = require('boom')
const { idForOrganizationAndHash } = require('./id')
const { promiseSettings, invalidateSettings } = require('./auth')
const bucketName = process.env.B2_BUCKET_NAME

const findItemContent = R.curry(({ content = true, stream = false }, { organization, sha256 }) => {
	const makeRequest = () => (
		promiseSettings()
		.then(({ authorizationToken, downloadUrl }) => {
			const id = idForOrganizationAndHash(organization, sha256)
			return axios({
				method: content ? 'get' : 'head',
				url: `${downloadUrl}/file/${bucketName}/${id}`,
				responseType: stream ? 'stream' : 'arraybuffer',
				headers: {
					'Authorization': authorizationToken
				}
			})
		})
	)
	
	return makeRequest()
	.catch((error) => {
		console.error(error)
		// If token has expired
		if (error.status === 401) {
			console.log('B2 token has expired')
			invalidateSettings()
			return makeRequest()
		}
		else {
			throw error
		}
	})
	.then(R.tap(response => {
		console.log('response', response)
	}))
	.then(R.prop('data'))
	.catch((error) => {
		throw Boom.create(error.status)
	})
})

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
