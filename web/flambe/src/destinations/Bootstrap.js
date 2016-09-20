import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
import rgba from 'react-sow/rgba'

import * as assets from './assets'
import * as Vanilla from './Vanilla'
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
		alignSelf='center'
		margin={{ bottom: '0.5rem' }}
		maxWidth='20em'
		children={ title }
	/>
)
export const cta = button

const panelTagsToClass = R.converge(
	R.unapply(R.join(' ')), [
		R.always('panel'),
		R.cond([
			[ R.has('primary'), R.always('panel-primary') ],
			[ R.has('success'), R.always('panel-success') ],
			[ R.has('info'), R.always('panel-info') ],
			[ R.has('warning'), R.always('panel-warning') ],
			[ R.has('danger'), R.always('panel-danger') ],
			[ R.T, R.always('panel-default') ]
		])
	]
)

export const panel = (tags, mentions, text, children, Element, resolveContent) => (
	<Seed Component='div'
		className={ panelTagsToClass(tags) }
		alignSelf='center'
		margin={{ bottom: '0.5rem' }}
		maxWidth='20em'
	>
		<div className='panel-heading'>
			<h2 className='panel-title' children={ text } />
		</div>
		<div className='panel-body'>
		{
			children.map((element, index) => (
				<Element { ...element } key={ index } />
			))
		}
		</div>
	</Seed>
)

const elementRendererForTags = Vanilla.extendTagConds([
	[ R.has('card'), R.curry(panel) ],
	[ R.has('panel'), R.curry(panel) ],
	[ R.has('button'), R.curry(button) ],
	[ R.has('cta'), R.curry(cta) ]
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
