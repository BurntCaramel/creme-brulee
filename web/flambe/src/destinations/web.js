import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'

const isPassword = (tags, mentions, title) => (
	R.test(/\bpassword\b/i, title)
)

export const field = (tags, mentions, title) => (
	<label>
		<span children={ title } style={{ display: 'block' }} />
		<input type={ isPassword(tags, title) ? 'password' : 'text' } />
	</label>
)

export const button = (tags, mentions, title) => (
	<button children={ title } />
)
export const cta = button

export const text = (tags, mentions, content) => (
	<span children={ content } />
)

export const image = (tags, mentions, content) => (
	<Seed minHeight={ 150 } />
)

export const fallback = (tags, mentions, content) => {
	console.log('mentions', mentions)
	return R.isEmpty(mentions) ? (
		text(tags, mentions, content)
	) : (
		mentions[0]
	)
}

const elementRendererForTags = R.cond([
	[ R.contains('#field'), R.curry(field) ],
	[ R.contains('#button'), R.curry(button) ],
	[ R.contains('#cta'), R.curry(cta) ],
	[ R.contains('#image'), R.curry(image) ],
	[ R.contains('#text'), R.curry(text) ],
	[ R.T, R.curry(fallback) ]
])

const resolveReferences = (source) => {
	console.log('source', source)
	return R.map(R.prop(R.__, source))
}

const sectionSpacing = '2rem'

export default ({ props }) => R.map(R.pipe( // sections
	R.map(R.pipe( // lines
		R.map(R.converge( // elements
			R.call, [
				R.pipe(
					R.prop('tags'),
					elementRendererForTags
				),
				R.pipe(
					R.prop('references'),
					resolveReferences(props)
				),
				R.prop('name')
			]
		)),
		(elements) => (
			<Seed children={ elements } />
		)
	)),
	(elements) => (
		<Seed column margin={{ bottom: sectionSpacing }} alignItems='center' children={ elements } />
	)
))
