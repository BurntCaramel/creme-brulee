import R from 'ramda'
import React from 'react'
import { Seed } from 'react-seeds'

import resolveReferences from './resolveReferences'

export const renderElement = ({ ingredients, elementRendererForTags }) => {
	const renderElement = R.converge(
		R.call, [
			R.pipe(
				R.prop('tags'),
				elementRendererForTags
			),
			R.pipe(
				R.prop('references'),
				resolveReferences(ingredients)
			),
			R.prop('text'),
			R.prop('children'),
			() => renderElement
		]
	)

	return renderElement
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
