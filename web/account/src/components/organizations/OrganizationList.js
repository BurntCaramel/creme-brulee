import React from 'react'
import emojid from 'emojid'

console.log('emojid', emojid)

import { listTagsInOrganization } from '../../actions/organizations'
import { findItemsWithTags }from '../../actions/items'

/*function OrganizationTags({ tags }) {
	return (
		<ul>
		{
			tags.map(({ tag, count }) => (
				<li>
				{ tag } · { count }
				</li>
			))
		}
		</ul>
	)
}*/

const itemStyle = {
	display: 'inline-block',
	fontSize: 24,
	letterSpacing: 2,
	marginBottom: '0.333em',
	padding: '0.166em 0.333em',
	backgroundColor: '#f8f8f8',
	borderRadius: 4,
	textDecoration: 'none'
}

const placeholderStyle = {
	...itemStyle,
	width: '7.9em'
}

function Item({ organizationName, sha256 }) {
	return (
		<a href={ `/1/preview:auto/@${ organizationName }/${ sha256 }` } title={ sha256 }
			style={ itemStyle }
		>
		{ sha256.substring(0, 7).toLowerCase().split('').map((hex) => emojid.base16ToEmoji[hex]).join('') }
		</a>
	)
}

function makeItemPlaceholders(count) {
	const items = new Array(count)

	const item = (
		<li>
			<span style={ placeholderStyle }>
				&nbsp;
			</span>
		</li>
	)

	for (let index = 0; index < count; index++) {
		items[index] = item
	}

	return items
}

const TagItems = React.createClass({
	getInitialState() {
		return {
			items: null
		}
	},

	componentWillMount() {
		const { token, organizationName, tag } = this.props
		findItemsWithTags({ token, organizationName, tags: [ tag ] })
		.then((items) => {
			this.setState({ items })
		})
	},

	render() {
		const { organizationName, count } = this.props
		const { items } = this.state
		return (
			<ul style={{ listStyle: 'none' }}>
			{
				(items != null) ? (
					items.map(({ sha256 }) => (
						<li>
							<Item organizationName={ organizationName } sha256={ sha256 } />
						</li>
					))
				) : (
					makeItemPlaceholders(count)
				)
			}
			</ul>
		)
	}
})

const OrganizationTag = React.createClass({
	getInitialState() {
		return {
			showItems: false
		}
	},

	onToggleItems() {
		this.setState(({ showItems }) => ({ showItems: !showItems }))
	},

	render() {
		const { tag, count, token, organizationName } = this.props
		const { showItems } = this.state
		return (
			<li>
				<h3 onClick={ this.onToggleItems }>
				{ tag } · { count }
				</h3>
			{ showItems &&
				<TagItems token={ token } organizationName={ organizationName } tag={ tag } count={ count } />
			}
			</li>
		)
	}
})

const OrganizationTags = React.createClass({
	getInitialState() {
		return {
			tags: null,
			showItems: false
		}
	},

	componentWillMount() {
		const { token, organizationName } = this.props
		listTagsInOrganization({ token, organizationName })
		.then((tags) => {
			this.setState({ tags })
		})
	},

	onToggleItems() {
		this.setState(({ showItems }) => ({ showItems: !showItems }))
	},

	render() {
		const { token, organizationName } = this.props
		const { tags, showItems } = this.state
		return ( tags != null &&
			<ul style={{ listStyle: 'none' }}>
			{
				tags.map(({ tag, count }) => (
					<OrganizationTag key={ tag}
						tag={ tag }
						count={ count }
						token={ token }
						organizationName={ organizationName }
					/>
				))
			}
			</ul>
		)
	}
})

const Organization = React.createClass({
	getInitialState() {
		return {
			showTags: false
		}
	},

	onToggleTags() {
		this.setState(({ showTags }) => ({ showTags: !showTags }))
	},

	loadTags() {
		const { token, name } = this.props
		return listTagsInOrganization({ token, organizationName: name })
	},

	render() {
		const { token, name } = this.props
		const { showTags } = this.state

		return (
			<div>
				<h2 onClick={ this.onToggleTags }>@{ name }</h2>
				{ showTags &&
					//<PromiseComponent Component={ OrganizationTags } createPromise={ this.loadTags } propName='tags' />
					<OrganizationTags token={ token } organizationName={ name } />
				}
			</div>
		)
	}
})

export default function OrganizationList({ organizations, token }) {
	return (
		<div>
		{
			organizations.map((organization) => (
				<Organization key={ organization.name }
					{ ...organization }
					token={ token }
				/>
			))
		}
		</div>
	)
}
