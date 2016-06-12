const R = require('ramda')
const axios = require('axios')
const Boom = require('boom')
const Crypto = require('crypto')
const { idForOrganizationAndHash } = require('./id')
const { promiseSettings } = require('./auth')
const bucketID = process.env.B2_BUCKET_ID

const hashBuffer = (buffer, hashType) => {
	const hash = Crypto.createHash(hashType)
	hash.update(buffer)
	return hash.digest('hex')
}

const publishItem = ({ organization, sha256, contentBuffer, force = false }) => (
	promiseSettings()
	.then(({ authorizationToken, apiUrl }) => (
		axios({
			method: 'POST',
			url: `${apiUrl}/b2api/v1/b2_get_upload_url`,
			data: {
				bucketId: bucketID
			},
			headers: {
				'Authorization': authorizationToken
			}
		})
	))
	.then(R.prop('data'))
	.then(({ authorizationToken, uploadUrl: uploadURL }) => {
		console.log('sha256', sha256)
		
		const calculatedHash = hashBuffer(contentBuffer, 'sha256')
		
		console.log('calculatedHash', calculatedHash, sha256)
		
		if (!R.equals(sha256, calculatedHash)) {
			return Promise.reject(Boom.conflict('Expected SHA256 hash to match', {
				calculatedHash,
				expectedHash: sha256 
			}))
		}
		
		const sha1 = hashBuffer(contentBuffer, 'sha1')
		
		const id = idForOrganizationAndHash(organization, sha256)
		
		console.log(
			uploadURL,
			id,
			sha1,
			calculatedHash
		)
		
		return axios({
			method: 'POST',
			url: uploadURL,
			// Annoyingly axios requires ArrayBuffer not Buffer. In Node 6, Buffer is Uint8Array http://stackoverflow.com/a/31394257/652615
			data: contentBuffer.buffer.slice(contentBuffer.byteOffset, contentBuffer.byteOffset + contentBuffer.byteLength),
			headers: {
				'Authorization': authorizationToken,
				'X-Bz-File-Name': id,
				'Content-Type': 'b2/x-auto',
				'Content-Length': contentBuffer.length,
				'X-Bz-Content-Sha1': sha1,
				'X-Bz-Info-Organization': organization, 
				'X-Bz-Info-SHA256': sha256
			}
		})
		.catch(error => console.error(error))
		.then(R.always({ success: true, wasNew: true, sha256 }))
	})
)

module.exports = {
	publishItem
}
