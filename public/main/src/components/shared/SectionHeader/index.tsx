import React, { useState, useCallback } from 'react'

import Section from '../../../models/Section'
import ToggleExpandedButton from './ToggleExpandedButton'
import { formatNumber } from '../../../utils'

import { ReactComponent as ShareIcon } from '../../../images/icons/share.svg'

import '../../../scss/components/SectionHeader/index.scss'

const SectionHeader = (
	{ section, isExpanded, toggleExpanded, onShare }: {
		section: Section
		isExpanded: boolean
		toggleExpanded: () => void
		onShare: () => void
	}
) => {
	const [degrees, setDegrees] = useState(0)
	
	const onClick = useCallback(() => {
		toggleExpanded()
		setDegrees(degrees => degrees + 180)
	}, [toggleExpanded, setDegrees])
	
	return (
		<div className="section-header default" onClick={onClick}>
			<p className="name">
				{section.name}
			</p>
			<div className="divider" />
			<p className="card-count">
				({formatNumber(section.numberOfCards)} card{section.numberOfCards === 1 ? '' : 's'})
			</p>
			<ToggleExpandedButton degrees={degrees}>
				{isExpanded}
			</ToggleExpandedButton>
			{section.isUnsectioned || (
				<button
					className="share"
					onClick={event => {
						event.stopPropagation()
						onShare()
					}}
				>
					<ShareIcon />
				</button>
			)}
		</div>
	)
}

export default SectionHeader
