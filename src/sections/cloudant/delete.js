const R = require('ramda')
const { databases } = require('./init')
const nodePromise = require('../../utils/nodePromise')

// FIXME: needs _rev?
const deleteItem = (
	({ organization, sha256 }) => nodePromise((callback) => {
		databases.items.destroy(`${organization}/${sha256}`, callback)
	})
)

module.exports = {
	deleteItem
}
