import R from 'ramda'

export default function createGetter(ingredient, variationIndexes) {
	if (ingredient.type === 'json') {
		return R.path(R.__, ingredient.content)
	}
	else if (ingredient.type === '') {

	}
}
