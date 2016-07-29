export function css({ url, id }) {
	if (document.getElementById(id)) {
		return
	}
	
	let styleElement = document.createElement('link')
	styleElement.id = id
	styleElement.rel = 'stylesheet'
	styleElement.type = 'text/css'
	styleElement.href = url
	document.head.appendChild(styleElement)
}

export function js({ url, id }) {
	if (document.getElementById(id)) {
		return
	}

	let scriptElement = document.createElement('link')
	scriptElement.id = id
	scriptElement.type = 'text/javascript'
	scriptElement.src = url
	document.head.appendChild(scriptElement)
}