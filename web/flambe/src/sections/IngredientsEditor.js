import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'

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
	{ value: 'error', title: 'Error' }
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
			ingredients.map(({ id, type, variations }, index) => {
				const selectedVariation = R.defaultTo(0, R.path([id], ingredientIDToVariationIndex))
				return (
					<Seed key={ index }
						column
						basis={ itemWidth }
						minWidth={ itemWidth }
						margin={{ left: gutter, right: gutter }}
					>
						<Seed row>
							<Field
								value={ id }
								grow={ 1 }
								onChange={ (newID) => onChangeAtIndex(index,
									R.merge(R.__, { id: newID })
								) }
								{ ...stylers.ingredientIDField }
							/>
							<Choice
								styler={ stylers.ingredientButton }
								value={ type } items={ types }
								onChange={ (newType) => onChangeAtIndex(index, 
									R.merge(R.__, { type: newType })
								) }
							/>
							<RemoveButton onClick={
								() => {
									onRemoveAtIndex(index)
								}
							} />
						</Seed>
						<VariationTabs
							selectedIndex={ selectedVariation }
							count={ variations.length }
							onSelect={
								(variationIndex) => {
									onSelectVariation({ ingredientIndex: index, variationIndex })
								}
							}
							onAdd={
								() => {
									onAddVariationAtIndex(index)
								}
							}
						/>
						<Field
							value={ variations[selectedVariation].rawContent }
							onChange={
								(newRawContent) => {
									onChangeAtIndex(index, R.evolve({
										variations: R.adjust(
											R.merge(R.__, { rawContent: newRawContent }),
											selectedVariation
										)
									}))
								}
							}
							{ ...stylers.ingredientContentField({ error: variations[selectedVariation].error }) }
						/>
					</Seed>
				)
			})
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
	onAddNew, onChangeAtIndex, onRemoveAtIndex, onAddVariationAtIndex, onSelectVariation
}) {
	return (
		<Seed row>
			<List
				ingredients={ ingredients }
				ingredientIDToVariationIndex={ ingredientIDToVariationIndex }
				onChangeAtIndex={ onChangeAtIndex }
				onRemoveAtIndex={ onRemoveAtIndex }
				onAddVariationAtIndex={ onAddVariationAtIndex }
				onSelectVariation={ onSelectVariation }
				onAddNew={ onAddNew }
			/>
		</Seed>
	)
}