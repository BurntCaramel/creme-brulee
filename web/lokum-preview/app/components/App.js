import React from 'react'
import Axios from 'axios'
import { routesForTrelloData, promiseEnhancedTrelloCards } from 'lokum/lib/trello'

const headerHeight = '2rem'

const headerStyle = {
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	height: headerHeight
}

const iframeHolderStyle = {
	position: 'absolute',
	top: headerHeight,
	left: 0,
	right: 0,
	bottom: 0
}

const iframeStyle = {
	display: 'block',
	width: '100%',
	height: '100%',
	border: 'none'
}

export default class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {

		}

		this.onChangeBoardID = this.onChangeBoardID.bind(this)
		this.onSetIFrame = this.onSetIFrame.bind(this)
	}

	componentDidMount() {
		window.navigatePreviewToPath = this.reloadFrame.bind(this)
	}

	componentWillUnmount() {
		delete window.navigatePreviewToPath
	}

	loadBoard(boardID) {
		Axios.get(`https://trello.com/b/${ boardID }.json`)
    .then(response => {
			const routes = routesForTrelloData(response.data)
			this.setState({
				boardJSON: response.data,
				routes
			}, () => {
				this.reloadFrame()
			})
		})
	}

	onChangeBoardID({ target }) {
		this.loadBoard(target.value)
	}
	
	onSetIFrame(iframe) {
		this.iframe = iframe
		this.reloadFrame()
	}

	renderPath(pathToFind) {
		const { routes } = this.state
		if (!routes) {
			return
		}

		const matchingRoute = routes.find(({ path }) => path === pathToFind)
		if (!matchingRoute) {
			return
		}

		let output = ''
		matchingRoute.handler({}, (html) => {
			output = html
		})

		return output
	}

	reloadFrame(path = '/') {
		if (!this.iframe) {
			return
		}

		const { contentDocument } = this.iframe

		const html = this.renderPath(path) || ''
		contentDocument.open()
		contentDocument.write(html)
		contentDocument.write(`
<script>
function hijackAClick(e) {
	console.log('CLICK!', e.currentTarget.host, location.host)
	const target = e.currentTarget;
	if (target && target.pathname && target.host === location.host && target.pathname[0] === '/' && target.pathname[1] !== '/') {
		parent.navigatePreviewToPath(target.pathname);
		event.preventDefault();
		event.stopPropagation();
	}
} 

var links = document.getElementsByTagName('a');
for (var i = 0; i < links.length; i++) {
	console.log('link', links[i])
	links[i].addEventListener('click', hijackAClick)
}
</script>
`)
		contentDocument.close()
	}

	render() {
		return (
			<main>
				<header style={ headerStyle }>
					Trello Board ID:
					&nbsp;
					<input type="text" onChange={ this.onChangeBoardID } />
				</header>
				<div style={ iframeHolderStyle }>
					<iframe ref={ this.onSetIFrame } style={ iframeStyle } />
				</div>
			</main>
		)
	}
}