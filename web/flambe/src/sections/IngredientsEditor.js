import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
import { observer } from 'mobx-react'

import Button from '../ui/Button'
import Field from '../ui/Field'
import Choice from '../ui/Choice'
import Tabs from '../ui/Tabs'
import * as stylers from '../stylers'

const types = [
	{ value: 'text', title: 'Text' },
	{ value: 'image', title: 'Image' },
	//{ value: 'markdown', title: 'Markdown' },
	{ value: 'json', title: 'Record' },
	//{ value: 'csv', title: 'CSV' },
	//{ value: 'gist', title: 'Gist' },
	//{ value: 'icing', title: 'Icing' },
	//{ value: 'error', title: 'Error' }
]

const itemWidth = 270
const gutter = 5

const ReferenceHeading = (props) => (
	<Seed Component='h3'
		text={{ align: 'center' }}
		{ ...props }
	/>
)

const IngredientButton = (props) => (
	<Button { ...props } { ...stylers.ingredientButton(props) } />
)

const RemoveButton = (props) => (
	<Button children='×' minWidth={ 32 } huge { ...props } styler={ stylers.ingredientButton } />
)

const AddButton = (props) => (
	<Button children='Add ingredient…'
		grow={ 1 }
		basis={ itemWidth } minWidth={ itemWidth } height={ 32 }
		{ ...props }
		styler={ stylers.masterButton }
	/>
)

const ReferenceActions = ({ onAddNew }) => (
	<Seed row
		shrink={ 0 }
		basis={ 100 }
		margin={{ left: gutter, right: gutter * 2 }}
	>
		<AddButton onClick={ onAddNew } />
	</Seed>
)

const VariationTabs = ({ selectedIndex, count, onSelect, onAdd }) => (
	<Tabs
		items={
			R.concat(
				R.times((index) => ({
					title: (index + 1),
					selected: (index === selectedIndex),
					onClick: () => onSelect(index)	
				}), count),
				{ title: '+', onClick: onAdd }
			)
		}
		buttonStyler={ stylers.ingredientButton }
	/>
)

const Brick = observer(function Brick({
	info,
	ingredientIndex,
	brickIndex,
	onChangeAtIndex
}) {
	return (
		<Seed row>
			<Button
				width='1.35rem'
				children={ info.result.error ? '!' : info.enabled ? '✓' : '·' }
				styler={ stylers.ingredientButton }
				onClick={
					() => {
						onChangeAtIndex(ingredientIndex, (ingredient) => {
							ingredient.variations[brickIndex].toggleEnabled()
						})
					}
				}
			/>
			<Field grow={ 1 }
				value={ info.rawContent }
				onChange={
					(newRawContent) => {
						onChangeAtIndex(ingredientIndex, (ingredient) => {
							console.dir(ingredient.variations.toJS())
							ingredient.variations[brickIndex].rawContent = newRawContent
						})
					}
				}
				{ ...stylers.ingredientContentField({ error: info.result.error }) }
			/>
		</Seed>
	) 
})

const Item = observer(function Item({
	index: ingredientIndex,
	ingredient,
	ingredientIDToVariationIndex,
	onChangeAtIndex,
	onRemoveAtIndex,
	onAddVariationAtIndex,
	onAddNew
}) {
	const { id, type, variations } = ingredient
	const selectedVariation = R.defaultTo(0, R.path([id], ingredientIDToVariationIndex))
	return (
		<Seed
			column
			basis={ itemWidth }
			width={ itemWidth }
			margin={{ left: gutter, right: gutter }}
		>
			<Seed row>
				<Field
					value={ id }
					grow={ 1 }
					onChange={ (newID) => onChangeAtIndex(ingredientIndex,
						//R.merge(R.__, { id: newID })
						(ingredient) => { ingredient.id = newID }
					) }
					{ ...stylers.ingredientIDField }
				/>
				<Choice
					styler={ stylers.ingredientButton }
					value={ type } items={ types }
					onChange={ (newType) => onChangeAtIndex(ingredientIndex, 
						//R.merge(R.__, { type: newType })
						(ingredient) => { ingredient.type = newType }
					) }
				/>
				<RemoveButton onClick={
					() => {
						onRemoveAtIndex(ingredientIndex)
					}
				} />
			</Seed>
			{
				variations.map((info, index) => (
					<Brick
						info={ info }
						ingredientIndex={ ingredientIndex }
						brickIndex={ index }
						onChangeAtIndex={ onChangeAtIndex }
					/>
				))
			}
			<Button
				children='+'
				onClick={
					() => {
						onAddVariationAtIndex(ingredientIndex)
					}
				}
				styler={ stylers.ingredientButton }
			/>
		</Seed>
	)
})

function List({
	ingredients,
	ingredientIDToVariationIndex,
	onChangeAtIndex,
	onRemoveAtIndex,
	onAddVariationAtIndex,
	onSelectVariation,
	onAddNew
}) {
	return (
		<Seed row>
		{
			ingredients.map((ingredient, index) => (
				<Item key={ index }
					{ ...{
						index,
						ingredient,
						ingredientIDToVariationIndex,
						onChangeAtIndex,
						onRemoveAtIndex,
						onAddVariationAtIndex,
						onAddNew
					} }
				/>
			))
		}
			<ReferenceActions
				onAddNew={ onAddNew }
			/>
		</Seed>
	)
}

export default function References({
	ingredients,
	ingredientIDToVariationIndex,
	onAddNew, onChangeAtIndex, onRemoveAtIndex, onAddVariationAtIndex
}) {
	return (
		<Seed row>
			<List
				ingredients={ ingredients }
				ingredientIDToVariationIndex={ ingredientIDToVariationIndex }
				onChangeAtIndex={ onChangeAtIndex }
				onRemoveAtIndex={ onRemoveAtIndex }
				onAddVariationAtIndex={ onAddVariationAtIndex }
				onAddNew={ onAddNew }
			/>
		</Seed>
	)
}