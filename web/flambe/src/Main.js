import R from 'ramda'
import React from 'react'
import { findDOMNode } from 'react-dom'
import seeds, { Seed } from 'react-seeds'

import { parseInput } from './parser'
import * as destinations from './destinations'
import validateContent from './ingredients/validateContent'

import * as colors from './colors'
import * as stylers from './stylers'
import Button from './ui/Button'
import Field from './ui/Field'
import References from './sections/references'
import PreviewTabs from './sections/components/PreviewTabs'

const catchRenderErrors = false

const suggestReferenceFromTree = R.uncurryN(2, (ingredients) => R.pipe(
	R.chain(R.pluck('references')),
	R.unnest,
	R.difference(R.__, R.pluck('id', ingredients)),
	R.head,
))

export default React.createClass({
	getDefaultProps() {
		return {
			showTree: false
		}
	},

	getInitialState() {
		const {
			initialContent: content,
			initialIngredients: ingredients
		} = this.props

		return {
			content,
			contentTree: !!content ? parseInput(content) : null,
			ingredients: R.map(validateContent, ingredients),
			destination: destinations.web
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

	componentDidMount() {
		const { destination } = this.state
		destination.init(findDOMNode(this))
	},

  render() {
		const { showTree } = this.props
		const { content, contentTree, ingredients, destination } = this.state

		console.dir(contentTree)

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
					<Seed column grow={ 1 } padding='1rem'>
					{
						!!contentTree ? (
							catchRenderErrors ? (
								R.tryCatch(
								(contentTree) => destination.renderTree({ ingredients, contentTree }),
								(error, contentTree) => console.error('Invalid tree', error, contentTree)
							)(contentTree)
							) : (
								destination.renderTree({ ingredients, contentTree })
							)	
						) : null
					}
					</Seed>
					{ false &&
						<PreviewTabs />
					}
				</Seed>
			</Seed>
		)
  }
})
