import R from 'ramda'
import React from 'react'
import { findDOMNode } from 'react-dom'
import seeds, { Seed } from 'react-seeds'
import Frame from 'react-frame-component'

import { parseInput } from './parser'
import * as destinations from './destinations'
import validateContent from './ingredients/validateContent'

import * as colors from './colors'
import * as stylers from './stylers'
import Button from './ui/Button'
import Field from './ui/Field'
import Choice from './ui/Choice'
import References from './sections/references'
import PreviewTabs from './sections/components/PreviewTabs'

const catchRenderErrors = false

const suggestReferenceFromTree = R.uncurryN(2, (ingredients) => R.pipe(
	R.chain(R.pluck('references')),
	R.unnest,
	R.map(R.head),
	R.difference(R.__, R.pluck('id', ingredients)),
	R.head // First pick
))

const iframeStyler = seeds({
	grow: 1,
	border: 'none'
})

function DestinationChoice({
	destinationID, destinations,
	onChange
}) {
	const items = R.pipe(
		R.toPairs,
		R.map(R.converge(R.merge, [
			R.pipe(
				R.prop(0),
				R.objOf('value')
			),
			R.pipe(
				R.prop(1),
				R.pick(['title'])
			)
		]))
	)(destinations)

	return (
		<Choice
			value={ destinationID }
			items={ items }
			onChange={ onChange }
		/>
	)
}

export default React.createClass({
	getDefaultProps() {
		return {
			showTree: false,
			initialDestinationID: 'bootstrap'
		}
	},

	getInitialState() {
		const {
			initialContent: content,
			initialIngredients: ingredients,
			initialDestinationID: destinationID 
		} = this.props

		return {
			content,
			contentTree: !!content ? parseInput(content) : null,
			ingredients: R.map(validateContent, ingredients),
			destinationID,
			destination: destinations[destinationID]
		}
	},

	onSourceChange(input) {
		this.setState({
			content: input,
			contentTree: parseInput(input)
		})
	},

	onAddNewIngredient(event) {
		this.setState(({ ingredients, contentTree }) => {

			return {
				ingredients: ingredients.concat({
					id: R.when(
						R.isNil,
						R.always('untitled'),
						suggestReferenceFromTree(ingredients, contentTree)
					),
					type: 'text',
					content: ''
				})
			}
		})
	},

	onChangeIngredientAtIndex(index, newValue) {
		this.setState(({ ingredients }) => ({
			ingredients: R.update(
				index,
				validateContent(newValue),
				ingredients
			)
		}))
	},

	onRemoveIngredientAtIndex(index) {
		this.setState(({ ingredients }) => ({
			ingredients: R.remove(index, 1, ingredients)
		}))
	},

	onChangeDestination(newDestinationID) {
		this.setState({
			destinationID: newDestinationID
		})
	},

  render() {
		const { showTree } = this.props
		const {
			content, contentTree, ingredients, destinationID, destination
		} = this.state

		console.dir(contentTree)
		console.dir(ingredients)

    return (
			<Seed row wrap justifyContent='center'
				grow={ 1 } shrink={ 0 }
			>
				<Seed column
					grow={ 1 } shrink={ 0 } basis='50%'
					{ ...stylers.mainColumn }
				>
					<Field
						value={ content }
						onChange={ this.onSourceChange }
						{ ...stylers.sourceField }
					/>
					<References
						ingredients={ ingredients }
						onAddNew={ this.onAddNewIngredient }
						onChangeAtIndex={ this.onChangeIngredientAtIndex }
						onRemoveAtIndex={ this.onRemoveIngredientAtIndex }
					/>
				</Seed>
				{ showTree &&
					<Seed row grow={ 1 } shrink={ 1 }
						{ ...stylers.preview }>
						<pre>
						{
							!!contentTree ? JSON.stringify(contentTree, null, 2) : null
						}
						</pre>
					</Seed>
				}
				<Seed column
					grow={ 1 } shrink={ 0 } basis='50%'
					background={{ color: colors.lightKeyA }}
					{ ...stylers.mainColumn }
				>
					<Seed column grow={ 1 }>
					{
						!!contentTree ? (
							catchRenderErrors ? (
								R.tryCatch(
								(contentTree) => destination.renderTree({ ingredients, contentTree }),
								(error, contentTree) => console.error('Invalid tree', error, contentTree)
							)(contentTree)
							) : (
								<Frame
									key={ destinationID }
									head={ destination.head() }
									children={ destination.renderTree({ ingredients, contentTree }) }
									{ ...iframeStyler }
								/>
							)	
						) : null
					}
					</Seed>
					<DestinationChoice
						destinationID={ destinationID } destinations={ destinations }
						onChange={ this.onChangeDestination }
					/>
					{ false &&
						<PreviewTabs />
					}
				</Seed>
			</Seed>
		)
  }
})
