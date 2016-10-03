import React from 'react'
import { Seed } from 'react-seeds'

function Shelf({ title, items }) {
	return (
		<Seed>
			<h2 children={ title } />
			<Seed row wrap>
			{ items.map(({ tags }) => (
				<Seed>
					<Seed>
					{
						tags.map((tag) => (
							<a href={ urlToTag(tag) } children={ tag } />
						))
					}
					</Seed>
				</Seed>
			)) }
			</Seed>
		</Seed>
	)
}

export default function Pantry({
	organizationName,
	flows, // stories
	texts, // writings, documents,
	images,
	records,
	// recipes,
	onMoreFlows,
	onMoreTexts, // onMoreWritings
	onMoreImages,
	onMoreRecords,
}) {
	function urlToTag(tag) {
		return `/@{ organizationName }/tag/${ tag }`
	}

	return (
		<div>
			<Shelf title='Flows' items={ flows } onMore={ onMoreFlows } />
			<Shelf title='Texts' items={ texts } onMore={ onMoreTexts } />
			<Shelf title='Images' items={ images } onMore={ onMoreImages } />
			<Shelf title='Records' items={ records } onMore={ onMoreRecords } />
		</div>
	)
}
