import R from 'ramda'
import React from 'react'
import { Seed } from 'react-seeds'

import resolveReferencesUsing from './resolveReferences'

const renderContentUsing = (resolveReferences) => ({ references, text }) => {
	if (references != null && references.length > 0) {
		return resolveReferences(references)
	}
	else {
		return text
	}
}

export const renderElement = ({ ingredients, elementRendererForTags }) => {
	const resolveReferences = resolveReferencesUsing(ingredients)
	const renderContent = renderContentUsing(resolveReferences)

	const Element = R.converge(
		R.call, [
			R.pipe(
				R.prop('tags'),
				elementRendererForTags
			),
			R.pipe(
				R.prop('references'),
				resolveReferences
			),
			R.prop('text'),
			R.prop('children'),
			(ignore) => Element, // Have to put in closure as it is being assigned
			R.always(renderContent)
		]
	)

	return Element
}

export const DefaultSection = ({ children }) => (
	<Seed Component='section'
		column alignItems='center'
		margin={{ bottom: '2rem' }}
		children={ children }
	/>
)

export const DefaultMaster = 'div'

export const renderTreeUsing = ({
	elementRendererForTags,
	Section = DefaultSection,
	Master = DefaultMaster
}) => ({
	ingredients,
	contentTree
}) => {
	const Element = renderElement({ ingredients, elementRendererForTags }) 

	return (
		<Master>
		{
			contentTree.map((section, sectionIndex) => (
				<Section key={ sectionIndex }>
				{
					section.map((element, elementIndex) => (
						<Element key={ elementIndex } { ...element } />	
					))
				}
				</Section>
			))
		}
		</Master>
	)
}
