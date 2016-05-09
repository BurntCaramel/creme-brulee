const R = require('ramda')
const { PassThrough } = require('stream')
const hashStream = require('collected/hashStream')
const Boom = require('boom')
const { databases } = require('./init')
const { idForAccountAndHash } = require('./id')
const nodePromise = require('../../utils/nodePromise')
const notFoundIfEmpty = require('../../utils/notFoundIfEmpty')


function uploadAttachment({ account, sha256, contentStream, rev }) {
	console.log('uploadAttachment', account, sha256)
	
	const attachmentStream = databases.items.attachment.insert(
		idForAccountAndHash(account, sha256),
		'content',
		null,
		'application/octet-stream',
		{ rev }
	)
	const attachmentErrorPromise = new Promise((resolve, reject) => {
		attachmentStream.on('end', () => resolve(true))
		attachmentStream.on('error', reject)
	})
	
	const hashingPassStream = new PassThrough()
	const hashPromise = hashStream(hashingPassStream)
	
	// Stream to an intermediate
	const contentPassStream = new PassThrough()
	contentPassStream.pipe(attachmentStream)
	contentPassStream.pipe(hashingPassStream)
	// Allow streaming to begin now by starting the intermediate
	contentStream.pipe(contentPassStream)
	
	contentPassStream.on('end', () => console.log('contentPassStream end'))
	contentPassStream.on('finish', () => console.log('contentPassStream finish'))
	contentPassStream.on('error', (error) => console.log('contentPassStream error', error))
	
	attachmentStream.on('end', () => console.log('attachmentStream end'))
	attachmentStream.on('error', (error) => console.log('attachmentStream error', error))
	
	console.log('begin')
	
	return Promise.all([
		hashPromise,
		attachmentErrorPromise
	]).then(R.pipe(
		R.tap(results => console.log('Uploaded attachment', results)),
		R.head, // Just result of hashPromise
		R.unless(
			R.equals(sha256),
			(calculatedHash) => {
				throw Boom.conflict('Expected SHA256 hash to match', {
					calculatedHash,
					expectedHash: sha256 
				})
			}
		),
		R.always({ success: true, wasNew: true })
	))
}


const publishItem = ({ account, sha256, contentStream, force = false }) => (
	nodePromise((callback) => {
		databases.items.insert({
			_id: idForAccountAndHash(account, sha256),
			contentIsAttached: true,
			sha256
		}, callback)
	})
	.then(
		({ rev }) => (
			uploadAttachment({ account, sha256, contentStream, rev })
		),
		(error) => {
			if (error.statusCode === 409) {
				if (force) {
					return nodePromise((callback) => {
						databases.items.get(
							idForAccountAndHash(account, sha256),
							callback
						)
					})
					.then(({ rev }) => (
						uploadAttachment({ account, sha256, contentStream, rev })
					))
				}
				else {
					return Promise.resolve({ success: true, wasNew: false })
				}
			}
			else {
				throw Boom.wrap(error)
			}
		}	
	)
)

module.exports = {
	publishItem
}
