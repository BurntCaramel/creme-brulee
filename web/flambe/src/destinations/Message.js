import R from 'ramda'
import React from 'react'
import seeds, { Seed } from 'react-seeds'

const metaFontSize = 14

function MetaPair({ title, content, resolveContent }) {
	if (!content) {
		return <noscript />
	}

	return (
		<Seed Component='dl'
			row
			margin={{ bottom: '0.5em' }}
		>
			<Seed Component='dt'
				children={ title }
				margin={{ right: '0.5em' }}
				font={{ size: metaFontSize, weight: 'bold' }}
			/>
			<Seed Component='dd'
				children={ resolveContent(content) }
				font={{ size: metaFontSize }}
			/>
		</Seed>
	)
}

export const email = (tags, references, text, children, Element, resolveContent) => (
	<Seed width='90%'
		text={{ align: 'left' }}
		padding={{ top: '0.5em', base: '1em' }}
		boxShadow='0 2px 8px #bbb'
	>
		<MetaPair resolveContent={ resolveContent }
			title='From'
			content={ tags.from || { text: 'hello@yourservice.com' } }
		/>
		<MetaPair resolveContent={ resolveContent }
			title='To'
			content={ tags.to || { text: 'user@example.com' } }
		/>
		<Seed margin={{ top: '1em' }}>
			{ resolveContent({ text, references }) }
		</Seed>
	</Seed>
)

export const useWithFallback = (fallback) => R.cond([
	[ R.has('email'), R.curry(email) ],
	[ R.T, fallback ]
])