import R from 'ramda'
import React from 'react'
import { findDOMNode } from 'react-dom'
import seeds, { Seed } from 'react-seeds'
import { observer } from 'mobx-react'

import destinations from './destinations'

import * as colors from './colors'
import * as stylers from './stylers'
import Button from './ui/Button'
import Field from './ui/Field'
import Choice from './ui/Choice'
import IngredientsEditor from './sections/IngredientsEditor'
import PreviewSection from './sections/preview'

import createObservableState from './state'

export default observer(React.createClass({
	getDefaultProps() {
		return {
			showTree: false,
			initialDestinationID: 'foundation',
			initialDestinationDevice: 'phone'
		}
	},

	getInitialState() {
		const {
			initialDestinationID: destinationID,
			initialDestinationDevice: destinationDevice
		} = this.props

		return {
			destinationID,
			destinationDevice
		}
	},

	componentWillMount() {
		const {
			initialContent: content,
			initialIngredients: allIngredients,
			initialDestinationID: destinationID,
			initialDestinationDevice: destinationDevice,
			initialScenarios: scenarios,
			initialActiveScenarioIndex: activeScenarioIndex = 0
		} = this.props

		createObservableState(this, {
			content, allIngredients, scenarios, activeScenarioIndex
		})
	},

	onSourceChange(input) {
		this.setContent(input)
	},

	onChangeDestination(newDestinationID) {
		this.setState({
			destinationID: newDestinationID
		})
	},

	onPhoneDestination() {
		this.setState({
			destinationDevice: 'phone'
		})
	},

	onFullDestination() {
		this.setState({
			destinationDevice: 'full'
		})
	},

	onClickDrag({ type, currentTarget, target, clientX }) {
		if (type == 'mouseup') {
			this.dragging = false
		}
		else if (this.dragging || type == 'mousedown') {
			if (type == 'mousemove') {
				currentTarget.scrollLeft += (this.mouseX - clientX)
			}

			if (type == 'mouseup') {
				this.dragging = false
			}
			else {
				// Only allow clicking on background
				if (target.tagName == 'DIV') {
					this.dragging = true
					this.mouseX = clientX
				}
			}
		}
	},

  render() {
		const { showTree } = this.props
		const {
			destinationID,
			destinationDevice
		} = this.state

		const {
			content,
			contentTree,
			allIngredients,
			activeIngredients,
			scenarios,
			activeScenarioIndex
		} = this

		const scenario = scenarios[activeScenarioIndex]

		console.dir(scenario)
		console.dir(contentTree)
		console.dir(activeIngredients)

    return (
			<Seed row justifyContent='center'
				grow={ 0 } shrink={ 0 }
			>
				<Seed row
					grow={ 1 } shrink={ 2 }
					minWidth={ 320 }
					overflow='scroll'
					onMouseDown={ this.onClickDrag }
					onMouseMove={ this.onClickDrag }
					onMouseUp={ this.onClickDrag }
				>
					<Seed column
						grow={ 1 }
						{ ...stylers.mainColumn }
					>
						<Field
							value={ content }
							onChange={ this.onSourceChange  }
							{ ...stylers.sourceField }
						/>
					</Seed>
					<Seed column>
						<IngredientsEditor
							ingredients={ allIngredients }
							ingredientIDToVariationIndex={ scenario }
							onAddNew={ this.onAddNewIngredient }
							onChangeAtIndex={ this.onChangeIngredientAtIndex }
							onRemoveAtIndex={ this.onRemoveIngredientAtIndex }
							onAddVariationAtIndex={ this.onAddVariationAtIndex }
						/>
					</Seed>
				</Seed>
				{ showTree &&
					<Seed row grow={ 1 } shrink={ 1 }
						{ ...stylers.preview }
					>
						<pre>
						{
							!!contentTree ? JSON.stringify(contentTree, null, 2) : null
						}
						</pre>
					</Seed>
				}
				<PreviewSection
					contentTree={ contentTree }
					ingredients={ activeIngredients }
					destinationID={ destinationID }
					destinationDevice={ destinationDevice }
					destinations={ destinations }
					onChangeDestination={ this.onChangeDestination }
					onPhoneDestination={ this.onPhoneDestination }
					onFullDestination={ this.onFullDestination }
				/>
			</Seed>
		)
  }
}))
