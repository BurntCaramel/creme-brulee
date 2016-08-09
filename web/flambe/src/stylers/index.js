import seeds from 'react-seeds'

import * as colors from '../colors' 

export const mainColumn = seeds({
	minWidth: 320,
	maxWidth: 414,
	margin: { left: '0.25rem', right: '0.25rem' }
	//padding: { top: '1rem' }
})

export const sourceField = ({
	column: true,
	width: '100%',
	padding: '1rem',
	font: { size: 16 },
	text: { color: colors.source.text },
	background: { color: colors.source.background },
	border: { width: 1, style: 'solid', color: colors.source.border }
})

export const markdownField = ({
	column: true,
	width: '100%',
	padding: '1rem',
	font: { size: 16 },
	//text: { color: colors.light },
	background: { color: colors.lightKeyB },
	border: { width: 1, style: 'solid', color: colors.light1mid }
})

export const ingredientContentField = ({ error }) => ({
	padding: '0.5rem',
	font: { size: 16 },
	text: { align: 'left', color: colors.ingredient.field.text },
	background: { color: error != null ? colors.errorFieldBackground : colors.ingredient.field.background },
	border: { width: 1, style: 'solid', color: colors.ingredient.field.border }
})

export const ingredientIDField = ingredientContentField({})

export const ingredientButton = ({ selected }) => {
	const buttonColors = colors.ingredient.button[selected ? 'selected' : 'normal']
	return {
		text: { color: buttonColors.text },
		background: { color: buttonColors.background },
		border: { width: 1, style: 'solid', color: buttonColors.border }
	}
}

export const masterButton = ({ selected }) => ({
	text: { color: colors.light },
	background: { color: colors.dark }
})
