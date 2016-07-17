
const R = require('ramda')

const makeObject = R.uncurryN(2, ({ key, mergeWith = {} }) => R.pipe(
	R.objOf(key),
	R.merge(mergeWith)
))

module.exports = makeObject