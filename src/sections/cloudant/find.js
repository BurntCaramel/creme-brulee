const R = require('ramda')
const Boom = require('boom')
const { PassThrough } = require('stream')
const { databases } = require('./init')
const { idForAccountAndHash } = require('./id')
const nodePromise = require('../../utils/nodePromise')

const findItem = R.pipeP(
	({ account, sha256 }) => {
		return nodePromise((callback) => {
			const id = idForAccountAndHash(account, sha256)
			databases.items.get(
				id,
				callback
			)
			/*databases.items.find({
				selector: { sha256 } // FIXME
			}, callback)*/
		})
		.catch(error => {
			console.log('error', error)
			throw Boom.create(error.statusCode)
		})
	}
	// First document
	//R.path(['docs', 0]),
	// 404 if nothing
	//notFoundIfEmpty
)

const findItemInfo = R.pipeP(
	findItem,
	R.path(['_attachments', 'length']),
	R.objOf('contentLength')
)

const findItemContent = R.pipeP(
	findItem,
	R.cond([
		[
			// Use content prop, if present
			R.has('content'),
			R.prop('content')
		],
		[
			// Use document’s attachment, if present
			//R.pathSatisfies(R.complement(R.isNil), ['_attachments', 'length']),
			R.has('contentIsAttached'),
			R.pipe(
				R.prop('_id'),
				(id) => R.ifElse(
					R.propEq('stream', true),
					() => {
						const stream = new PassThrough()
						// Must pipe, as this is a http.ClientRequest,
						// not the readable http.IncomingMessage stream
						databases.items.attachment.get(id, 'content').pipe(stream)
						
						return stream
					},
					() => nodePromise((callback) => {
						databases.items.attachment.get(id, 'content', callback)
					})
				)
			)
		],
		[
			R.T,
			() => { throw Boom.resourceGone('No file associated with item') }
		]
	])
)

const promiseStreamOfItemContent = R.pipeP(
	findItemContent,
	(load) => load({ stream: true })
)

const promiseItemContent = R.pipeP(
	findItemContent,
	(load) => load({ stream: false })
)

module.exports = {
	findItemInfo,
	promiseStreamOfItemContent,
	promiseItemContent
}
