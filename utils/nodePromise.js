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

module.exports = nodePromise
