import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
import rgba from 'react-sow/rgba'

import { renderElement, renderTreeUsing } from './render'

const isPassword = (tags, mentions, title) => (
	[
		R.has('password', tags),
		R.test(/\bpassword\b/i, title)
	].some(Boolean)
)

export const field = (tags, mentions, title) => (
	<label>
		<span children={ title } style={{ display: 'block' }} />
		<input type={ isPassword(tags, title) ? 'password' : 'text' } />
	</label>
)

export const button = (tags, mentions, title) => (
	<Seed Component='button'
		margin={{ bottom: '0.5rem' }}
		maxWidth='20em'
		children={ title }
	/>
)
export const cta = button

const wrapInLink = (tags, element) => {
	if (R.has('link', tags)) {
		return (
			<a href={ tags.link } children={ element } />
		)
	}
	else {
		return element
	}
}

export const text = (tags, mentions, content) => {
	const Component = (
		R.has('heading', tags) ? (
			R.has('primary', mentions) ? (
				'h1'
			) : (
				'h2'
			)
		) : (
			'p'
		)
	)

	return wrapInLink(tags,
		<Seed Component={ Component }
			maxWidth='30rem'
			children={ content }
		/>
	)
}

const imageHeight = 150
const imageBackground = { color: rgba.whiteValue(0, 0.1) }

export const image = (tags, mentions, content) => (
	<Seed Component='figure' column
		grow={ 1 } width='100%' minHeight={ imageHeight }
		text={{ align: 'center' }}
		children={(
			R.has('caption', tags) ? ([
				<Seed key='image'
					height={ imageHeight }
					background={ imageBackground }
				/>,
				<Seed key='caption' Component='figcaption'
					text={{ lineHeight: '1.3' }}
					font={{ style: 'italic' }}
					children={ content }
				/>
			]) : (
				<Seed key='image'
					column justifyContent='center'
					height={ imageHeight }
					font={{ style: 'italic' }}
					background={ imageBackground }
					children={ content }
				/>
			)
		)}
	/>
)

export const video = (tags, mentions, content) => (
	<Seed Component='figure' column
		grow={ 1 } alignItems='center' justifyContent='center'
		width='100%' minHeight={ 150 }
		background={{ color: rgba.whiteValue(0, 0.1) }}
		children='▶'
	/>
)

const hexColorRegex = /^[a-fA-F09]{3,6}$/

export const swatch = (tags, mentions, content) => (
	<Seed
		width={ 32 }
		height={ 32 }
		background={{
			color: R.when(
				R.isEmpty,
				R.always(R.find(R.test(hexColorRegex), tags)),
				content
			)
		}}
	/>
)

export const columns = (tags, mentions, content, children, renderElement) => {
	console.log('columns', children)
	return <Seed row justifyContent='space-around'
		children={ children.map(renderElement) }
	/>
}

export const fallback = (tags, mentions, content) => (
	R.isEmpty(mentions) ? (
		text(tags, mentions, content)
	) : (
		mentions[0]
	)
)

const elementRendererForTags = R.cond([
	[ R.has('columns'), R.curry(columns) ],
	[ R.has('field'), R.curry(field) ],
	[ R.has('button'), R.curry(button) ],
	[ R.has('cta'), R.curry(cta) ],
	[ R.has('image'), R.curry(image) ],
	[ R.has('video'), R.curry(video) ],
	[ R.has('text'), R.curry(text) ],
	[ R.has('swatch'), R.curry(swatch) ],
	[ R.T, R.curry(fallback) ]
])

export const renderTree = renderTreeUsing({ elementRendererForTags })

export function init() {
}

export function deinit() {
}
