import R from 'ramda'
import React from 'react'
import { findDOMNode } from 'react-dom'
import seeds, { Seed } from 'react-seeds'
import { extendObservable, observable, action } from 'mobx'
import { observer } from 'mobx-react'

import { parseInput } from './parser'
import destinations from './destinations'
import validateContent, { transformerForType, stringRepresenterForType } from './ingredients/validateContent'

import * as colors from './colors'
import * as stylers from './stylers'
import Button from './ui/Button'
import Field from './ui/Field'
import Choice from './ui/Choice'
import IngredientsEditor from './sections/IngredientsEditor'
import PreviewSection from './sections/preview'

const suggestReferenceFromTree = R.uncurryN(2, (ingredients) => R.pipe(
	R.chain(R.pluck('references')),
	R.unnest,
	R.map(R.head), // Just the requested ingredient ID
	R.difference(R.__, R.pluck('id', ingredients)), // Only IDs that are yet to be used
	R.head // First pick
))

function createObservableIngredientVariation(ingredient, { rawContent }) {
	return observable({
		rawContent,
		get result() {
			const transform = transformerForType(ingredient.type)
			return R.tryCatch(
				transform,
				R.objOf('error')
			)(this.rawContent)
		},
		adjustRawContent: action(function(adjuster) {
			this.rawContent = adjuster(this.rawContent)
		}),
		adjustContent: action(function(adjuster) {
			const result = this.result
			if (result.content) {
				adjuster(result.content)
				this.rawContent = stringRepresenterForType(ingredient.type, result.content)
			}
		}),
		editPath: action(function(path, editor) {
			this.adjustContent((content) => {
				const [
					parent,
					key
				] = (path.length == 1) ? [
					content,
					path[0]
				] : [
					R.path(initialPath, content),
					R.last(path)
				]
				
				if (parent) {
					editor(parent, key)
				}
				else {
					// Warn user about incorrect key path?
				}
			})
		}),
		adjustPath: action(function(path, adjuster) {
			this.editPath(path, (parent, key) => {
				parent[key] = adjuster(parent[key]) 
			})
		})
	})
}

function createObservableIngredient(ingredient) {
	return extendObservable(ingredient, {
		variations: ingredient.variations.map(
			R.curry(createObservableIngredientVariation)(ingredient)
		)
	})
}

function createObservableState(target, {
	content, allIngredients, scenarios, activeScenarioIndex
}) {
	return extendObservable(target, {
		content,
		setContent: action(function(newContent) {
			this.content = newContent
		}),
		get contentTree() {
			return parseInput(this.content)
		},
		allIngredients: allIngredients.map(createObservableIngredient),
		scenarios,
		activeScenarioIndex,
		get activeScenario() {
			return this.scenarios[this.activeScenarioIndex]
		},
		get activeIngredients() {
			const activeScenario = this.activeScenario
			return this.allIngredients.reduce((object, { id, type, variations }) => {
				const activeVariation = variations[R.propOr(0, id, activeScenario)]
				object[id] = {
					type,
					rawContent: activeVariation.rawContent,
					result: activeVariation.result,
					variationReference: activeVariation
				}
				return object
			}, {})
		},
		activeVariationForIngredientAtIndex(index) {
			const ingredient = this.allIngredients[index]
			if (ingredient && ingredient.variations.length > 0) {
				const activeScenario = this.activeScenario
				return ingredient.variations[R.propOr(0, ingredient.id, activeScenario)]
			}
		},
		addIngredient: action(function() {
			target.allIngredients.append(createObservableIngredient({
				id: R.when(
					R.isNil,
					R.always('untitled'),
					suggestReferenceFromTree(target.allIngredients, target.contentTree)
				),
				type: 'text',
				variations: [
					{
						rawContent: ''
					}
				]
			}))
		}),
		// Use target to allow prebinding
		onChangeIngredientAtIndex: action(function(index, adjuster) {
			adjuster(target.allIngredients[index])
			/*const variation = target.activeVariationForIngredientAtIndex(index)
			if (variation) {
				variation.adjustRawContent(adjuster)	
			}*/
			//this.activeVariationForIngredientAtIndex(index).adjustContent(adjuster)
		}),
		onRemoveIngredientAtIndex: action(function(index) {
			target.allIngredients.splice(index, 1)
		}),
		onAddVariationAtIndex: action(function(index) {
			target.allIngredients[index].variations.append({
				rawContent: ''
			})
		})
	})
}

export default observer(React.createClass({
	getDefaultProps() {
		return {
			showTree: false,
			initialDestinationID: 'foundation',
			initialDestinationDevice: 'phone'
		}
	},

	getInitialState() {
		const {
			initialContent: content,
			initialIngredients: ingredients,
			initialDestinationID: destinationID,
			initialDestinationDevice: destinationDevice,
			initialScenarios: scenarios,
			initialActiveScenarioIndex: activeScenarioIndex = 0
		} = this.props

		return {
			content,
			contentTree: !!content ? parseInput(content) : null,
			ingredients: observable(R.map(validateContent, ingredients)),
			destinationID,
			destinationDevice,
			scenarios,
			activeScenarioIndex
		}
	},

	componentWillMount() {
		const {
			initialContent: content,
			initialIngredients: allIngredients,
			initialDestinationID: destinationID,
			initialDestinationDevice: destinationDevice,
			initialScenarios: scenarios,
			initialActiveScenarioIndex: activeScenarioIndex = 0
		} = this.props

		createObservableState(this, {
			content, allIngredients, scenarios, activeScenarioIndex
		})
	},

	onSourceChange(input) {
		this.setContent(input)
		/*this.setState({
			content: input,
			contentTree: parseInput(input)
		})*/
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

	onPhoneDestination() {
		this.setState({
			destinationDevice: 'phone'
		})
	},

	onFullDestination() {
		this.setState({
			destinationDevice: 'full'
		})
	},

	onClickDrag({ type, currentTarget, target, clientX }) {
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
				// Only allow clicking on background
				if (target.tagName == 'DIV') {
					this.dragging = true
					this.mouseX = clientX
				}
			}
		}
	},

  render() {
		const { showTree } = this.props
		const {
			//content,
			//contentTree,
			//ingredients,
			destinationID,
			destinationDevice,
			//scenarios,
			//activeScenarioIndex
		} = this.state

		const {
			content,
			contentTree,
			allIngredients,
			activeIngredients,
			scenarios,
			activeScenarioIndex
		} = this

		const scenario = scenarios[activeScenarioIndex]

		console.dir(scenario)
		console.dir(contentTree)
		console.dir(activeIngredients)

    return (
			<Seed row justifyContent='center'
				grow={ 0 } shrink={ 0 }
			>
				<Seed row
					grow={ 1 } shrink={ 2 }
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
							ingredients={ allIngredients }
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
					ingredients={ activeIngredients }
					destinationID={ destinationID }
					destinationDevice={ destinationDevice }
					destinations={ destinations }
					onChangeDestination={ this.onChangeDestination }
					onPhoneDestination={ this.onPhoneDestination }
					onFullDestination={ this.onFullDestination }
				/>
			</Seed>
		)
  }
}))
