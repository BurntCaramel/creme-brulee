import React from 'react'
import seeds, { Seed } from 'react-seeds'
import Button from './Button'

const buttonStyler = seeds({
	grow: 1,
	height: 42
})

function TabItem({ title, selected }) {
	return (
		<Button children={ title } { ...buttonStyler } />
	)
}

function Tabs({ items, ...others }) {
	return (
		<Seed Component='nav' row { ...others }>
		{
			items.map(TabItem)
		}
		</Seed>
	)
}

export default Tabs