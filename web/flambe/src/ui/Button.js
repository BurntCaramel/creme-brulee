import React from 'react'
import seeds, { Seed } from 'react-seeds'

import * as colors from '../colors'

const fontSizeForProps = (props) => (
	(props.huge) ? (
		24
	) : (props.small) ? (
		14
	) : (
		16
	)
)

export default ({ huge, small, selected, ...props }) => (
	<Seed Component='button'
		{ ...props }
		font={{ size: fontSizeForProps({ huge, small }) }}
		text={{ color: selected ? colors.light : colors.dark }}
		background={{ color: selected ? colors.dark : colors.light }}
		border={{ width: 1, style: 'solid', color: selected ? colors.dark : colors.light1mid }}
	/>
)