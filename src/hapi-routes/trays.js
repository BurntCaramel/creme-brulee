const R = require('ramda')
const Boom = require('boom')
const preMethods = require('./pre/preMethods')
const throwWhenNil = require('../utils/throwWhenNil')
const preTray = require('./pre/tray')

const traysPath = '/1/@{organization}/trays'
const trayPath = `${traysPath}:{trayID}`
const cupPath = `${trayPath}:{cupID}` 

module.exports = [
	{
		method: 'GET',
		path: traysPath,
		config: {
			pre: preMethods({
				organization: R.path(['params', 'organization']),
				trays: preTray.promiseTrays
			})
		},
		handler({ pre: { trays } }, reply) { 
			reply([ ...trays.keys() ])
		}
	},
	{
		method: 'GET',
		path: trayPath,
		config: {
			pre: preMethods({
				organization: R.path(['params', 'organization']),
				trays: preTray.promiseTrays,
				tray: preTray.promiseTray
			})
		},
		handler({ pre: { tray } }, reply) { 
			reply([ ...tray.keys() ])
		}
	},
	{
		method: 'GET',
		path: cupPath,
		config: {
			pre: preMethods({
				organization: R.path(['params', 'organization']),
				trays: preTray.promiseTrays,
				tray: preTray.promiseTray,
				cup: preTray.promiseCup
			})
		},
		handler({ pre: { cup } }, reply) { 
			reply(cup)
		}
	},
	{
		method: 'PUT',
		path: cupPath,
		config: {
			auth: 'auth0token',
			payload: {
				parse: false,
				defaultContentType: 'application/octet-stream'
			},
			pre: preMethods({
				organization: R.path(['params', 'organization']),
				result: preTray.setCup
			})
		},
		handler(request, reply) {
			reply({ success: true })
		}
	}
]