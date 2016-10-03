module.exports = (server) => {
	// Cookies
	server.state('auth-session', {
		isSecure: true,
		clearInvalid: true
	})
}