const createError = (message, props) => Object.assign(
	new Error(message),
	props
)

module.exports = createError
