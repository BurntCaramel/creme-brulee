import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'

import Button from '../../ui/Button'
import Field from '../../ui/Field'
import * as stylers from '../../stylers'

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
			ingredients.map(({ id, content }, index) => (
				<Seed key={ index }
					column
					margin={{ top: '1rem' }}
				>
					<Seed row>
						<Field
							value={ id }
							grow={ 1 }
							onChange={ (value) => onChangeAtIndex(index, {
								id: value,
								content
							}) }
							{ ...stylers.ingredientIDField }
						/>
						<RemoveButton onClick={ () => onRemoveAtIndex(index) } />
					</Seed>
					<Field
						value={ content }
						onChange={ (value) => onChangeAtIndex(index, {
							id,
							content: value
						}) }
						{ ...stylers.sourceField }
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