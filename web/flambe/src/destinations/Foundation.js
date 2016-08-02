import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'
import rgba from 'react-sow/rgba'

import * as assets from './assets'
import * as Web from './Web'
import { renderTreeUsing } from './render'


const elementRendererForTags = R.cond([
	[ R.has('field'), R.curry(Web.field) ],
	[ R.has('button'), R.curry(Web.button) ],
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

export const renderTree = renderTreeUsing({ elementRendererForTags })

export function init(el) {
	assets.cssScoped({
		id: 'foundation-css',
		url: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.3/foundation-flex.min.css',
		//url: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.3/foundation.min.css',
		scopeTo: el
	})
	assets.js({
		id: 'foundation-js',
		url: 'https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.3/foundation.min.js'
	})
}

export function deinit() {
	assets.remove(['foundation-css', 'foundation-js'])
}