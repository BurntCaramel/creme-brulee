import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
import rgba from 'react-sow/rgba'

import * as assets from './assets'
import * as Web from './Web'
import { renderTreeUsing } from './render'


const buttonTagsToClass = R.converge(
	R.unapply(R.join(' ')), [
		R.always('button'),
		R.cond([
			[ R.has('secondary'), R.always('secondary') ],
			[ R.has('disabled'), R.always('disabled') ],
			[ R.T, R.always('') ]
		]),
		R.cond([
			[ R.has('large'), R.always('large') ],
			[ R.has('small'), R.always('small') ],
			[ R.has('extrasmall'), R.always('tiny') ],
			[ R.T, R.always('') ]
		])
	]
)

export const button = (tags, mentions, title) => (
	<Seed Component='button'
		className={ buttonTagsToClass(tags) }
		margin={{ bottom: '0.5rem' }}
		maxWidth='20em'
		children={ title }
	/>
)
export const cta = button

const elementRendererForTags = R.cond([
	[ R.has('field'), R.curry(Web.field) ],
	[ R.has('button'), R.curry(button) ],
	[ R.has('cta'), R.curry(Web.cta) ],
	[ R.has('image'), R.curry(Web.image) ],
	[ R.has('video'), R.curry(Web.video) ],
	[ R.has('text'), R.curry(Web.text) ],
	[ R.has('swatch'), R.curry(Web.swatch) ],
	[ R.has('nav'), R.curry(Web.nav) ],
	[ R.has('columns'), R.curry(Web.columns) ],
	[ R.has('list'), R.curry(Web.list) ],
	[ R.T, R.curry(Web.fallback) ]
])

export const Preview = renderTreeUsing({ elementRendererForTags })

export const title = 'Foundation'

export function head() {
	return (
		<head>
			<link rel='stylesheet' type='text/css'
				href='https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.3/foundation-flex.min.css'
			/>
			<script
				src='https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.3/foundation.min.js'
			/>
		</head>
	)
}
