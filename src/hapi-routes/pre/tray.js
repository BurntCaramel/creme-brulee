const R = require('ramda')
const Boom = require('boom')
const preMethods = require('./preMethods')
const throwWhenNil = require('../../utils/throwWhenNil') 

// FIXME: use database
let traysByOrganization = new Map()

const promiseTrays = R.pipe(
	R.path(['pre', 'organization']),
	(organization) => (
		traysByOrganization.get(organization)
	)
)

const promiseTray = R.converge((trayID, trays) => (
	Promise.resolve(
		!!trays ? trays.get(trayID) : null
	)
	.then(throwWhenNil(Boom.notFound(`No tray found with id ${trayID}`)))
), [
	R.path(['params', 'trayID']),	
	R.path(['pre', 'trays'])
])

const promiseCup = R.converge((trayID, cupID, tray) => (
	Promise.resolve(
		!!tray ? tray.get(cupID) : null
	)
	.then(throwWhenNil(Boom.notFound(`No cup found with id ${cupID} in tray ${trayID}`)))
	.then(R.prop('content'))
), [
	R.path(['params', 'trayID']),
	R.path(['params', 'cupID']),	
	R.path(['pre', 'tray'])
])

const setCup = R.converge((organization, trayID, cupID, content) => {
	let trays = traysByOrganization.get(organization)
	if (!trays) {
		trays = new Map()
		traysByOrganization.set(organization, trays)
	}

	let tray = trays.get(trayID)
	if (!tray) {
		tray = new Map()
		trays.set(trayID, tray)
	}

	tray.set(cupID, { content })
}, [
	R.path(['pre', 'organization']),
	R.path(['params', 'trayID']),
	R.path(['params', 'cupID']),	
	R.path(['payload'])
])

module.exports = {
	promiseTrays,
	promiseTray,
	promiseCup,
	setCup
}
