import React from 'react'
import seeds, { Seed } from 'react-seeds'

import * as colors from '../colors'

const Choice = React.createClass({
	onChange(event) {
		const el = event.target
		const value = el.value
		this.props.onChange(value)
	},

	render() {
		const { value, items, onChange } = this.props

		return (
			<Seed Component='select'
				value={ value }
				onChange={ this.onChange }
				padding={{ top: 0, bottom: 0, left: '0.5em', right: '0.5em' }}
				font={{ size: 16 }}
				text={{ color: colors.dark }}
				background={{ color: colors.light }}
				border={{ width: 1, style: 'solid', color: colors.light1mid }}
				cornerRadius={ 0 }
			>
			{
				items.map(({ value, title }) => (
					<option key={ value }
						value={ value } children={ title }
					/>
				))
			}
			</Seed>
		)
	}
})

export default Choice
