const R = require('ramda')
const Boom = require('boom')
const { createElement } = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const { Screen, ActionList } = require('royal-piping')
const kit = require('royal-piping/lib/kits/ios')
const { makeMap: makeDevicesMap } = require('royal-piping/lib/devices/apple')

const devicesMap = makeDevicesMap()

module.exports = (options) => R.tryCatch(
	({ type, content, deviceID = 'iphone6' }) => (
		R.merge(options, {
			innerHTML: renderToStaticMarkup(
				createElement(
					R.cond([
						[
							R.equals('screen'),
							R.always(Screen)
						],
						[
							R.equals('actionList'),
							R.always(ActionList)
						],
						[
							R.T,
							() => { throw `Unknown type: '${type}'` }
						]
					])(type),
					{
						content: [].concat(content), // Ensure array
						kit,
						deviceInfo: devicesMap.get(deviceID)
					}
				)
			)
		})
	),
	(error) => {
		console.error(error)
		throw Boom.wrap(error, 406, 'Incorrect format for Royal Piping')
	}
)
