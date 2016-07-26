import React from 'react'
import seeds, { Seed } from 'react-seeds'

import { parseInput } from './parser'
import renderWebDestination from './destinations/web'

const colors = {
	mid: '#555',
	light1mid: '#eee', 
	light: '#f8f8f8'
}

const stylers = {
	sourceField: seeds({
		row: true,
		grow: 1,
		padding: '1em',
		border: { width: 1, style: 'solid', color: colors.light1mid },
		background: { color: colors.light }
	})
}


export default React.createClass({
	getDefaultProps() {
		return {
			showTree: false
		}
	},

	getInitialState() {
		return {
			data: null
		}
	},

	onSourceChange(e) {
		const sourceField = e.target
		const input = sourceField.value

		this.setState({
			data: parseInput(input)
		})
	},

  render() {
		const { showTree } = this.props
		const { data } = this.state

    return (
			<Seed row>
				<Seed row grow={ 1 } shrink={ 1 } minHeight='90vh'>
					<textarea
						onChange={ this.onSourceChange }
						{ ...stylers.sourceField }
						/>
				</Seed>
				{ showTree &&
					<Seed row grow={ 1 } shrink={ 1 } { ...stylers.preview }>
						<pre>
						{
							!!data ? JSON.stringify(data, null, 2) : null
						}
						</pre>
					</Seed>
				}
				<Seed column grow={ 1 } shrink={ 1 } padding='1rem' background={{ color: colors.light }}>
					{
						!!data ? renderWebDestination(data) : null
					}
				</Seed>
			</Seed>
		)
  }
})
