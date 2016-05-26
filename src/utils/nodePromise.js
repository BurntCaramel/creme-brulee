const R = require('ramda')
const conformPromiseError = require('./conformPromiseError')

function nodePromise(useCallback) {
    return new Promise((resolve, reject) => {
        useCallback((err, result) => {
            if (err) {
                reject(err)
            }
            else {
                resolve(result)
            }
        })
    })
}

nodePromise.conformedError = (useCallback, messageForStatus) => (
	conformPromiseError(nodePromise(useCallback), messageForStatus)
)

module.exports = nodePromise
