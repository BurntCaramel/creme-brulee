const R = require('ramda')
const { fromNode } = require('creed')
const Cloudant = require('cloudant')

// FIXME: use Cloudant API key instead
const cloudant = Cloudant({
	account: process.env.CLOUDANT_ACCOUNT,
	password: process.env.CLOUDANT_PASSWORD
})

const tags = cloudant.db.use('tags')

const fromNodeMethodsOf = R.mapObjIndexed(
	(method, name, target) => R.when(
		R.hasIn('bind'), // Only functions
		R.pipe(
			R.bind(R.__, target),
			fromNode
		)
	)(method)
)

const databases = {
	items: cloudant.db.use('items'),
	organizations: cloudant.db.use('organizations'),
	tags: fromNodeMethodsOf(tags)
	/*tags: {
		get: fromNode(tags.get.bind(tags)),
		insert: fromNode(tags.insert.bind(tags))
	}*/
	//users: cloudant.db.use('users')
}

module.exports = {
	cloudant,
	databases
}
