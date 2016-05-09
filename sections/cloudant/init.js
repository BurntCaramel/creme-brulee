const Cloudant = require('cloudant')

const cloudant = Cloudant({
	account: process.env.CLOUDANT_ACCOUNT,
	password: process.env.CLOUDANT_PASSWORD
})

const databases = {
	items: cloudant.db.use('items')
}

module.exports = {
	cloudant,
	databases
}
