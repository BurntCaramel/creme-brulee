const R = require('ramda')
const { databases } = require('./init')
const nodePromise = require('../../utils/nodePromise')

const deleteItem = (
	({ account, sha256 }) => nodePromise((callback) => {
		databases.items.destroy(`${account}/${sha256}`, callback)
	})
)

module.exports = {
	deleteItem
}
