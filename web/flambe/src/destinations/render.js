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

	const renderElementLocal = R.converge(
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
			(ignore) => renderElementLocal, // Have to put in closure as it is being assigned
			R.always(renderContent)
		]
	)

	return renderElementLocal
}

export const Section = (elements) => (
	<Seed Component='section'
		column alignItems='center'
		margin={{ bottom: '2rem' }}
		children={ elements }
	/>
)

export const renderTreeUsing = ({ elementRendererForTags }) => ({ ingredients, contentTree }) => (
	R.map(R.pipe( // sections
		R.map(renderElement({ ingredients, elementRendererForTags })),
		Section
	))(contentTree)
)
