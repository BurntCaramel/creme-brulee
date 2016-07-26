import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'

const isPassword = (tags, title) => (
	R.test(/\bpassword\b/i, title)
)

export const field = (tags, title) => (
	<Seed grow={ 1 }>
		<label>
			<span children={ title } style={{ display: 'block' }} />
			<input type={ isPassword(tags, title) ? 'password' : 'text' } />
		</label>
	</Seed>
)

export const button = (tags, title) => (
	<Seed>
		<button children={ title } />
	</Seed>
)

export const cta = button

export const text = (tags, content) => (
	<Seed grow={ 1 } children={ content } />
)

export const image = (tags, content) => (
	<Seed minHeight={ 150 } />
)

const elementRenderer = R.cond([
	[ R.contains('#field'), R.curry(field) ],
	[ R.contains('#button'), R.curry(button) ],
	[ R.contains('#cta'), R.curry(cta) ],
	[ R.contains('#image'), R.curry(image) ],
	[ R.contains('#text'), R.curry(text) ],
	[ R.T, R.curry(text) ]
])

const sectionSpacing = '2rem'

export default R.map(R.pipe( // sections
	R.map(R.converge(
		R.call, [
			R.pipe(
				R.tap(tags => console.log('item', tags)),
				R.prop('tags'),
				R.tap(tags => console.log('tags', tags)),
				elementRenderer
			),
			R.prop('name')
		]
	)),
	(elements) => (
		<Seed column margin={{ bottom: sectionSpacing }} alignItems='center' children={ elements } />
	)
))
