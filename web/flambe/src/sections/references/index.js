import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'

import Button from '../../ui/Button'
import Field from '../../ui/Field'
import Choice from '../../ui/Choice'
import * as stylers from '../../stylers'

const types = [
	{ value: 'text', title: 'Text' },
	{ value: 'markdown', title: 'Markdown' },
	{ value: 'json', title: 'JSON' },
	{ value: 'csv', title: 'CSV' },
	{ value: 'gist', title: 'Gist' },
	{ value: 'icing', title: 'Icing' }
]

const ReferenceHeading = (props) => (
	<Seed Component='h3'
		text={{ align: 'center' }}
		{ ...props }
	/>
)

const RemoveButton = (props) => (
	<Button children='−' minWidth={ 32 } huge { ...props } />
)

function List({
	ingredients,
	onChangeAtIndex,
	onRemoveAtIndex
}) {
	return (
		<div>
		{
			ingredients.map(({ id, rawContent, type, error }, index) => (
				<Seed key={ index }
					column
					margin={{ top: '1rem' }}
				>
					<Seed row>
						<Field
							value={ id }
							grow={ 1 }
							onChange={ (newID) => onChangeAtIndex(index, {
								id: newID,
								rawContent,
								type
							}) }
							{ ...stylers.ingredientIDField }
						/>
						<Choice
							value={ type } items={ types }
							onChange={ (newType) => {
								console.log('change type', newType)
								onChangeAtIndex(index, {
									id,
									rawContent,
									type: newType
								})
							} }
						/>
						<RemoveButton onClick={ () => onRemoveAtIndex(index) } />
					</Seed>
					<Field
						value={ rawContent }
						onChange={ (newRawContent) => onChangeAtIndex(index, {
							id,
							rawContent: newRawContent,
							type
						}) }
						{ ...stylers.ingredientContentField({ error }) }
					/>
				</Seed>
			))	
		}
		</div>
	)
}


const AddButton = (props) => (
	<Button children='+' grow={ 1 } huge { ...props } />
)

const ReferenceActions = ({ onAddNew }) => (
	<Seed row margin={{ top: '1rem' }}>
		<AddButton onClick={ onAddNew } />
	</Seed>
)


export default function References({
	ingredients,
	onAddNew, onChangeAtIndex, onRemoveAtIndex
}) {
	return (
		<Seed>
			<List
				ingredients={ ingredients }
				onChangeAtIndex={ onChangeAtIndex }
				onRemoveAtIndex={ onRemoveAtIndex }
			/>
			<ReferenceActions
				onAddNew={ onAddNew }
			/>
		</Seed>
	)
}