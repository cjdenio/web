import React, { memo } from 'react'
import cx from 'classnames'

import usePreview from './usePreview'
import CardSide from '../../shared/CardSide'

import { ReactComponent as ToggleIcon } from '../../../images/icons/toggle.svg'

import '../../../scss/components/Home/Preview.scss'

const Preview = () => {
	const {
		cardsRemaining,
		currentSide,
		isWaitingForRating,
		deck,
		section,
		card,
		nextCard,
		predictions,
		flip,
		rate
	} = usePreview()
	
	return (
		<div className="preview">
			<div className="background" />
			<div className="content">
				<div className="preview-navbar">
					<div className="location">
						<p className="count">{cardsRemaining}</p>
						<p className="text">remaining</p>
					</div>
				</div>
				<div className="card-container">
					<div className="location">
						<p className="deck">{deck.name}</p>
						<div className="divider" />
						{section && (
							<p className="section">{section.name}</p>
						)}
						{card && !card.forgotCount && (
							<p className="flag">New</p>
						)}
					</div>
					<div className="cards">
						<div className="card foreground">
							<div className="container">
								{card && (
									<CardSide className="content">
										{card[currentSide]}
									</CardSide>
								)}
								{isWaitingForRating && (
									<div className="flip">
										<p>{currentSide}</p>
										<ToggleIcon style={{ transform: 'scale(3)' }} />
									</div>
								)}
							</div>
						</div>
						{/* <div className="card foreground-2">
							
						</div> */}
						<div className={cx(
							'card',
							'background-1',
							{ hidden: cardsRemaining < 2 }
						)} />
						<div className={cx(
							'card',
							'background-2',
							{ hidden: cardsRemaining < 3 }
						)} />
					</div>
				</div>
				<div className="footer">
					
				</div>
			</div>
		</div>
	)
}

export default memo(Preview)
