const R = require('ramda')
const Boom = require('boom')

const { idForOrganizationAndHash } = require('./id')

const createFind = (requestAPI) => {
	const findItemContent = R.curry(({ content = true, stream = false }, { organization, sha256 }) => {
		return requestAPI(({ downloadUrl, bucketName }) => {
			const id = idForOrganizationAndHash(organization, sha256)
			return {
				method: content ? 'get' : 'head',
				url: `${ downloadUrl }/file/${ bucketName }/${ id }`,
				responseType: stream ? 'stream' : 'arraybuffer',
			}
		})
		.then(R.prop('data'))
		.catch((error) => {
			throw Boom.create(error.status)
		})
	})

	return {
		promiseItemInfo: R.pipeP(
			findItemContent({ content: false }),
			R.pipe(
				R.path(['headers', 'content-length']),
				R.objOf('contentLength')
			)
		),
		promiseStreamOfItemContent: findItemContent({ stream: true }),
		promiseItemContent: findItemContent({ stream: false })
	}
}

module.exports = createFind
