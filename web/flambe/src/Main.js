import R from 'ramda'
import React from 'react'
import { findDOMNode } from 'react-dom'
import seeds, { Seed } from 'react-seeds'
import Frame from 'react-frame-component'

import { parseInput } from './parser'
import destinations from './destinations'
import validateContent from './ingredients/validateContent'

import * as colors from './colors'
import * as stylers from './stylers'
import Button from './ui/Button'
import Field from './ui/Field'
import Choice from './ui/Choice'
import IngredientsEditor from './sections/IngredientsEditor'
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
	//grow: 1,
	height: 600,
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
			width='100%'
			minHeight={ 32 }
			grow={ 1 }
			border='none'
			//maxWidth='20em'
			onChange={ onChange }
			styler={ stylers.masterButton }
		/>
	)
}

function PreviewSection({
	contentTree,
	ingredients,
	ingredientVariationIndexes,
	destinationID,
	destinations,
	onChangeDestination
}) {
	const { head: renderHead, Preview } = destinations[destinationID]

	return (
		<Seed column alignItems='center'
			grow={ 1 } shrink={ 0 }
			{ ...stylers.previewColumn }
		>
			<Seed key={ destinationID }
				column
				grow={ 1 } width='100%'
			>
			{
				!!contentTree ? (
					catchRenderErrors ? (
						R.tryCatch(
						(contentTree) => (
							<Preview
								ingredients={ ingredients }
								ingredientVariationIndexes={ ingredientVariationIndexes }
								contentTree={ contentTree }
							/>
						),
						(error, contentTree) => console.error('Invalid tree', error, contentTree)
					)(contentTree)
					) : (
						<Frame
							head={ renderHead() }
							children={
								<Preview
									ingredients={ ingredients }
									ingredientVariationIndexes={ ingredientVariationIndexes }
									contentTree={ contentTree }
								/>
							}
							{ ...iframeStyler }
						/>
					)	
				) : null
			}
			</Seed>
			<DestinationChoice
				destinationID={ destinationID } destinations={ destinations }
				onChange={ onChangeDestination }
			/>
			{ false &&
				<PreviewTabs />
			}
		</Seed>
	)
}

export default React.createClass({
	getDefaultProps() {
		return {
			showTree: false,
			initialDestinationID: 'foundation'
		}
	},

	getInitialState() {
		const {
			initialContent: content,
			initialIngredients: ingredients,
			initialDestinationID: destinationID,
			initialScenarios: scenarios,
			initialActiveScenarioIndex: activeScenarioIndex = 0
		} = this.props

		return {
			content,
			contentTree: !!content ? parseInput(content) : null,
			ingredients: R.map(validateContent, ingredients),
			destinationID,
			scenarios,
			activeScenarioIndex
		}
	},

	onSourceChange(input) {
		this.setState({
			content: input,
			contentTree: parseInput(input)
		})
	},

	onAddNewIngredient(event) {
		this.setState(({ ingredients, contentTree }) => ({
			ingredients: ingredients.concat({
				id: R.when(
					R.isNil,
					R.always('untitled'),
					suggestReferenceFromTree(ingredients, contentTree)
				),
				type: 'text',
				variations: [
					{
						rawContent: ''
					}
				]
			})
		}))
	},

	onChangeIngredientAtIndex(index, updater) {
		this.setState(R.evolve({
			ingredients: R.adjust(
				R.pipe(
					updater,
					validateContent
				),
				index
			)
		}))
	},

	onRemoveIngredientAtIndex(index) {
		this.setState(R.evolve({
			ingredients: R.remove(index, 1)
		}))
	},

	onAddVariationAtIndex(index) {
		this.setState(R.evolve({
			ingredients: R.pipe(
				R.adjust(
					R.evolve({
						variations: R.append({
							rawContent: ''
						})
					}),
					index
				),
				R.map(validateContent)
			)
		}))
	},

	onSelectVariation({ ingredientIndex, variationIndex }) {
		this.setState(({ ingredients, scenarios, activeScenarioIndex }) => ({
			scenarios: R.adjust(
				R.merge(R.__, {
					[ingredients[ingredientIndex].id]: variationIndex
				}),
				activeScenarioIndex
			)(scenarios)
		}))
	},

	onChangeDestination(newDestinationID) {
		this.setState({
			destinationID: newDestinationID
		})
	},

	onClickDrag({ type, currentTarget, clientX }) {
		if (type == 'mouseup') {
			this.dragging = false
		}
		else if (this.dragging || type == 'mousedown') {
			if (type == 'mousemove') {
				currentTarget.scrollLeft += (this.mouseX - clientX)
			}

			if (type == 'mouseup') {
				this.dragging = false
			}
			else {
				this.dragging = true
				this.mouseX = clientX
			}
		}
	},

  render() {
		const { showTree } = this.props
		const {
			content,
			contentTree,
			ingredients,
			destinationID,
			scenarios,
			activeScenarioIndex
		} = this.state

		const scenario = scenarios[activeScenarioIndex]

		console.dir(scenario)
		console.dir(contentTree)
		console.dir(ingredients)

    return (
			<Seed row justifyContent='center'
				grow={ 0 } shrink={ 0 }
			>
				<Seed row
					grow={ 1 } shrink={ 1 }
					minWidth={ 320 }
					overflow='scroll'
					onMouseDown={ this.onClickDrag }
					onMouseMove={ this.onClickDrag }
					onMouseUp={ this.onClickDrag }
				>
					<Seed column
						grow={ 1 }
						{ ...stylers.mainColumn }
					>
						<Field
							value={ content }
							onChange={ this.onSourceChange  }
							{ ...stylers.sourceField }
						/>
					</Seed>
					<Seed column>
						<IngredientsEditor
							ingredients={ ingredients }
							ingredientIDToVariationIndex={ scenario }
							onAddNew={ this.onAddNewIngredient }
							onChangeAtIndex={ this.onChangeIngredientAtIndex }
							onRemoveAtIndex={ this.onRemoveIngredientAtIndex }
							onAddVariationAtIndex={ this.onAddVariationAtIndex }
							onSelectVariation={ this.onSelectVariation }
						/>
					</Seed>
				</Seed>
				{ showTree &&
					<Seed row grow={ 1 } shrink={ 1 }
						{ ...stylers.preview }
					>
						<pre>
						{
							!!contentTree ? JSON.stringify(contentTree, null, 2) : null
						}
						</pre>
					</Seed>
				}
				<PreviewSection
					contentTree={ contentTree }
					ingredients={ ingredients }
					ingredientVariationIndexes={ scenario }
					destinationID={ destinationID }
					destinations={ destinations }
					onChangeDestination={ this.onChangeDestination }
				/>
			</Seed>
		)
  }
})
