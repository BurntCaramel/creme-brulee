const R = require('ramda')
const axios = require('axios')
const Boom = require('boom')
const Crypto = require('crypto')
const { idForOrganizationAndHash } = require('./id')
const { promiseSettings } = require('./auth')
const bucketID = process.env.B2_BUCKET_ID

const publishItem = ({ organization, sha256, contentBuffer, force = false }) => (
	promiseSettings()
	.then(({ apiUrl }) => (
		axios.post(`${apiUrl}/b2api/v1/b2_get_upload_url`, {
			data: {
				bucketId: bucketID
			}
		)
	)
	.then(R.prop('data'))
	.then(({ authorizationToken, uploadUrl }) => {
		const hash256 = Crypto.createHash('sha256')
		hash256.update(contentBuffer)
		const calculatedHash = hash.digest('hex')
		if (!R.equals(sha256, calculatedHash)) {
			return Promise.reject(Boom.conflict('Expected SHA256 hash to match', {
				calculatedHash,
				expectedHash: sha256 
			}))
		}
		
		const hash1 = Crypto.createHash('sha1')
		hash1.update(contentBuffer)
		const sha1 = hash1.digest('hex')
		
		const id = idForOrganizationAndHash(organization, sha256)
		
		return axios.post(uploadUrl, {
			headers: {
				'Authorization': authorizationToken,
				'X-Bz-File-Name': id,
				'Content-Type': 'b2/x-auto',
				'Content-Length': contentBuffer.length,
				'X-Bz-Content-Sha1': sha1,
				'X-Bz-Info-Organization': organization, 
				'X-Bz-Info-SHA256': sha256
			},
			// Annoyingly axios requires ArrayBuffer not Buffer. In Node 6, Buffer is Uint8Array http://stackoverflow.com/a/31394257/652615
			data: contentBuffer.buffer.slice(contentBuffer.byteOffset, contentBuffer.byteOffset + contentBuffer.byteLength)
		})
		.then(R.always({ success: true, wasNew: true, sha256 }))
	})
)

module.exports = {
	publishItem
}
