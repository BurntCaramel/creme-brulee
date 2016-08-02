import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
import rgba from 'react-sow/rgba'

import * as assets from './assets'
import * as Web from './Web'
import { renderTreeUsing } from './render'

const buttonTagsToClass = R.converge(
	R.unapply(R.join(' ')), [
		R.always('btn'),
		R.cond([
			[ R.has('primary'), R.always('btn-primary') ],
			[ R.has('link'), R.always('btn-link') ],
			[ R.T, R.always('btn-default') ]
		]),
		R.cond([
			[ R.has('large'), R.always('btn-lg') ],
			[ R.has('small'), R.always('btn-sm') ],
			[ R.has('extrasmall'), R.always('btn-xs') ],
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
	[ R.has('cta'), R.curry(cta) ],
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

export const title = 'Bootstrap'

export function head() {
	return (
		<head>
			<link rel='stylesheet' type='text/css'
				href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
			/>
			<script
				src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'
			/>
		</head>
	)
}
