import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'

import { parseInput } from './parser'
import renderWebDestination from './destinations/web'

const colors = {
	dark: '#262626',
	mid: '#555',
	light1mid: '#eee', 
	light: '#f8f8f8',
	lightKeyA: '#FBF9ED',
	lightKeyB: '#F3F9FF'
}

const stylers = {
	mainColumn: seeds({
		margin: { left: '0.5rem', right: '0.5rem' },
		//padding: { top: '1rem' }
	}),
	sourceField: seeds({
		column: true,
		width: '100%',
		padding: '1em',
		font: { size: 16 },
		//text: { color: colors.light },
		background: { color: colors.lightKeyB },
		border: { width: 1, style: 'solid', color: colors.light1mid }
	})
}

function updateFieldHeight(el) {
		el.style.height = '1px'
		el.style.height = `${el.scrollHeight}px`
}

const Button = (props) => (
	<Seed Component='button'
		{ ...props }
		font={{ size: 24, weight: 700 }}
		background={{ color: 'white' }}
		border='none'
	/>
)

const ReferenceHeading = (props) => (
	<Seed Component='h3'
		text={{ align: 'center' }}
		{ ...props }
	/>
)

const AddReferenceButton = ({ onClick }) => (
	<Button children='+' grow={ 1 } onClick={ onClick } />
)

const ReferenceActions = () => (
	<Seed row margin={{ top: '1rem' }}>
		<AddReferenceButton />
	</Seed>
)

export default React.createClass({
	getDefaultProps() {
		return {
			showTree: false
		}
	},

	getInitialState() {
		const content = this.props.initialContent

		return {
			content,
			data: !!content ? parseInput(content) : null
		}
	},

	setSourceField(el) {
		this.sourceField = el
		updateFieldHeight(el)
	},

	onSourceChange(event) {
		const sourceField = event.target

		updateFieldHeight(sourceField)

		const input = sourceField.value

		this.setState({
			content: input,
			data: parseInput(input)
		})
	},

  render() {
		const { showTree, sourceProps } = this.props
		const { content, data } = this.state

    return (
			<Seed row minHeight='90vh'>
				<Seed column grow={ 1 } shrink={ 1 } width={ 600 } { ...stylers.mainColumn }>
					<textarea
						ref={ this.setSourceField }
						value={ content }
						onChange={ this.onSourceChange }
						{ ...stylers.sourceField }
					/>
					<div>
					{
						R.pipe(
							R.toPairs,
							R.map(([id, value]) => {
								console.log('id', id, 'value', value)
								return (
									<Seed key={ `key-${id}` }
										column
									>
										<ReferenceHeading>{ id }</ReferenceHeading>
										<textarea
											value={ value }
											{ ...stylers.sourceField }
										/>
									</Seed>
								)
							})	
						)(sourceProps)
					}
					</div>
					<ReferenceActions />
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
				<Seed column
					grow={ 1 } shrink={ 1 } padding='1rem' background={{ color: colors.lightKeyA }}
					{ ...stylers.mainColumn }
				>
					{
						!!data ? renderWebDestination({ props: sourceProps })(data) : null
					}
				</Seed>
			</Seed>
		)
  }
})
