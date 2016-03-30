const createError = (message, props) => Object.assign(
	new Error(message),
	props
)