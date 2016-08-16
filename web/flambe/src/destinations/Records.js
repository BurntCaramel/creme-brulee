import R from 'ramda'
import React from 'react'
import JSONComponent from './JSONComponent'

// TODO: references, arrays with children
const toRecords = R.map(
	R.pipe(
		R.map(
			R.converge(
				(text, tags) => {
					console.log({ text, tags })
					return R.ifElse(
						R.isEmpty,
						R.always(text),
						R.pipe(
							R.reverse,
							R.reduce(R.flip(R.objOf), text)
						)
					)(tags)
				}, [
					R.prop('text'),
					R.pipe(
						R.prop('tags'),
						//R.filter(R.equals(true)),
						R.keys
					)
				]
			)
		),
		R.mergeAll
	)
)

export const Preview = ({ ingredients, contentTree }) => (
	<JSONComponent json={ toRecords(contentTree) } isDeserialized />
)

export const title = 'Records'

export { head } from './Raw'
