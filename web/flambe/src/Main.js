import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'

import { parseInput } from './parser'
//import * as Web from './destinations/Web'
import * as destinations from './destinations'

import * as colors from './colors'
import * as stylers from './stylers'
import Button from './ui/Button'
import Field from './ui/Field'
import References from './sections/references'
import PreviewTabs from './sections/components/PreviewTabs'

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
			ingredients
		}
	},

	onSourceChange(input) {
		this.setState({
			content: input,
			contentTree: parseInput(input)
		})
	},

	onAddNewIngredient(event) {
		this.setState(({ ingredients }) => ({
			ingredients: ingredients.concat({
				id: 'untitled',
				content: ''
			})
		}))
	},

	onChangeIngredientAtIndex(index, newValue) {
		this.setState(({ ingredients }) => ({
			ingredients: R.update(index, newValue, ingredients)
		}))
	},

	onRemoveIngredientAtIndex(index) {
		this.setState(({ ingredients }) => ({
			ingredients: R.remove(index, 1, ingredients)
		}))
	},

  render() {
		const { showTree } = this.props
		const { content, contentTree, ingredients } = this.state

		const destination = destinations.bootstrap
		destination.init()

    return (
			<Seed row grow={ 1 } shrink={ 0 } wrap>
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
						!!contentTree ? R.tryCatch(
							(contentTree) => destination.renderTree({ ingredients, contentTree }),
							(error, contentTree) => console.error('Invalid tree', contentTree)
						)(contentTree) : null
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
