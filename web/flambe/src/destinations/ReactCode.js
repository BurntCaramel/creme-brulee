import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'

import { renderTreeUsing } from './render'

const Code = ({ children, indent = 0 }) => (
	<Seed Component='pre' grow={ 1 } width='100%' text={{ align: 'left' }}>
	{ R.repeat('  ', indent) }
	{ children }
	</Seed>
) 

const field = (tag, mentions, text) => (
	<Code children={ `<Field title="${text}" />` } indent={ 2 } />
)

const button = (tag, mentions, text) => (
	<Code children={ `<button>${text}</button>` } indent={ 2 } />
)

const image = (tag, mentions, text) => (
	<Code>
	{
`    <figure>
      <img src="...">
      <figcaption>${ text }</figcaption>
    </figure>
`}
	</Code>
)

const text = (tag, mentions, text, children) => (
	<Code children={ `<span>${mentions[0] || text}</span>` } indent={ 2 } />
)

const elementRendererForTags = R.cond([
	[ R.has('field'), R.curry(field) ],
	[ R.has('button'), R.curry(button) ],
	[ R.has('cta'), R.curry(button) ],
	[ R.has('image'), R.curry(image) ],
	// [ R.has('video'), R.curry(Web.video) ],
	[ R.has('text'), R.curry(text) ],
	// [ R.has('swatch'), R.curry(Web.swatch) ],
	// [ R.has('nav'), R.curry(Web.nav) ],
	// [ R.has('columns'), R.curry(Web.columns) ],
	// [ R.has('list'), R.curry(Web.list) ],
	[ R.T, R.curry(text) ]
])

function Section({ children }) {
	return (
		<Seed children={ children } />
	)
}

function Master({ children, ingredients }) {
	const ingredientIDs = R.pipe(
		R.pluck('id'),
		R.join(', ')
	)(ingredients)

	return (
		<Seed>
			<Code children={ `function Component({ ${ingredientIDs} }) {` } />
			<Code children='return (' indent={ 1 } />
		{
			children
		}
			<Code children=')' indent={ 1 } />
			<Code children='}' />
		</Seed>
	)
}

export const Preview = R.pipe(
	renderTreeUsing({
		elementRendererForTags,
		Section,
		Master
	})
)

export const title = 'React Code'

export function head() {
	return (
		<head>
		</head>
	)
}