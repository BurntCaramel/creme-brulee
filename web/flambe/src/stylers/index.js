import seeds from 'react-seeds'

import * as colors from '../colors' 

export const mainColumn = seeds({
	minWidth: 320
	//margin: { left: '0.5rem', right: '0.5rem' },
	//padding: { top: '1rem' }
})

export const sourceField = seeds({
	column: true,
	width: '100%',
	padding: '1rem',
	font: { size: 16 },
	//text: { color: colors.light },
	background: { color: colors.lightKeyB },
	border: { width: 1, style: 'solid', color: colors.light1mid }
})

export const markdownField = seeds({
	column: true,
	width: '100%',
	padding: '1rem',
	font: { size: 16 },
	//text: { color: colors.light },
	background: { color: colors.lightKeyB },
	border: { width: 1, style: 'solid', color: colors.light1mid }
})

export const ingredientIDField = seeds({
	padding: '0.5rem',
	font: { size: 16 },
	text: { align: 'center' },
	background: { color: 'white' },
	border: { width: 1, style: 'solid', color: colors.light1mid }
})
