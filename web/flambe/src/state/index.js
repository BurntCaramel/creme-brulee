import R from 'ramda'
import { extendObservable, observable, action } from 'mobx'

import { parseInput } from '../parser'
import validateContent, { transformerForType, stringRepresenterForType } from '../ingredients/validateContent'

const suggestReferenceFromTree = R.uncurryN(2, (ingredients) => R.pipe(
	R.chain(R.pluck('references')),
	R.unnest,
	R.map(R.head), // Just the requested ingredient ID
	R.difference(R.__, R.pluck('id', ingredients)), // Only IDs that are yet to be used
	R.head // First pick
))

function createObservableIngredientVariation(ingredient, {
	enabled = true,
	rawContent
}) {
	return observable({
		enabled,
		rawContent,
		get result() {
			const transform = transformerForType(ingredient.type)
			return R.tryCatch(
				transform,
				R.objOf('error')
			)(this.rawContent)
		},
		toggleEnabled: action(function() {
			this.enabled = !this.enabled
		}),
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
		),
		addVariation: action(function(variation) { 
			this.variations.push(
				createObservableIngredientVariation(this, variation)
			)
		}),
		get flattenedResult() {
			let flattened = {
				type: this.type,
				variationReference: R.last(this.variations)
			}

			if (this.type == 'json') {
				flattened.content = this.variations.reduce((combined, { enabled, result }) => {
					if (!enabled || result.content == null) {
						return combined
					}

					return Object.assign(combined, result.content)
				}, {})
			}
			else {
				const variation = R.findLast(R.propEq('enabled', true), this.variations)
				if (variation) {
					flattened.content = variation.result.content
				}
			}

			return flattened
		}
	})
}

export default function createObservableState({
	content,
	allIngredients,
	scenarios,
	activeScenarioIndex,
	destinationID,
	destinationDevice
}) {
	const target = this
	return extendObservable(target, {
		content,
		get contentTree() {
			return parseInput(this.content)
		},
		allIngredients: allIngredients.map(createObservableIngredient),
		scenarios,
		activeScenarioIndex,
		destinationID,
		destinationDevice,
		get activeScenario() {
			return this.scenarios[this.activeScenarioIndex]
		},
		get activeIngredients() {
			const activeScenario = this.activeScenario
			return this.allIngredients.reduce((object, { id, flattenedResult }) => {
				object[id] = flattenedResult
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
				id: R.defaultTo(
					'untitled',
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
		}),
		onRemoveIngredientAtIndex: action(function(index) {
			target.allIngredients.splice(index, 1)
		}),
		onAddVariationAtIndex: action(function(index) {
			const ingredient = target.allIngredients[index]
			ingredient.addVariation({
				rawContent: ''
			})
		})
	})
}
