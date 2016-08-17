const { reject } = require('creed')

const requestAuthedTo = require('./api/auth')
const createFind = require('./api/find')
const createPublishItem = require('./api/publish')

const apiSettingsFromEnv = ({
	B2_ACCOUNT: account, B2_KEY: key, B2_BUCKET_NAME: bucketName, B2_BUCKET_ID: bucketID
}) => ({
	account, key, bucketName, bucketID
})
const apiSettings = apiSettingsFromEnv(process.env)
const requestAPI = requestAuthedTo(apiSettings)

const { promiseStreamOfItemContent, promiseItemContent } = createFind(requestAPI)
const publishItem = createPublishItem(requestAPI)

module.exports = [
		{
        method: 'GET',
        path: '/@{organization}/sha256:{sha256}',
        handler({
					params: { organization, sha256 }
				}, reply) {
					reply(
						promiseItemContent({
							organization,
							sha256
						})
					)
        }
    },
		{
        method: 'PUT',
        path: '/@{organization}/sha256:{sha256}',
				config: {
					payload: {
						parse: false,
						defaultContentType: 'application/octet-stream'
					}
				},
        handler({
					params: { organization, sha256 },
					payload
				}, reply) {
					reply(
						publishItem({
							organization,
							sha256,
							contentBuffer: payload
						})
						.catch(error => {
							console.error('ERRORRROR', error)
							return reject(error)
						})
					)
        }
    }
]