module.exports = (options) => ({
	md: require('./md')(options),
	icing: require('./icing')(options),
	plain: require('./plain')(options),
})