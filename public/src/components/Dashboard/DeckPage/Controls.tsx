import React from 'react'
import moment from 'moment'
import TimeAgo from 'javascript-time-ago'
import enLocale from 'javascript-time-ago/locale/en'

import Deck from '../../../models/Deck'
import useCurrentUser from '../../../hooks/useCurrentUser'
import Control from './Control'
import { formatNumber } from '../../../utils'

import { ReactComponent as OutlinedStar } from '../../../images/icons/outlined-star.svg'
import { ReactComponent as FilledStar } from '../../../images/icons/filled-star.svg'

TimeAgo.addLocale(enLocale)

const timeAgo = new TimeAgo('en-US')

export default ({ deck, hasDeck }: { deck: Deck, hasDeck: boolean }) => {
	const [currentUser] = useCurrentUser()
	
	const uid = currentUser?.id
	const rating = deck.userData?.rating ?? 0
	
	return (
		<div className="controls">
			<Control title="Ratings" className="ratings">
				<div className="top">
					
				</div>
				{uid && hasDeck && (
					<>
						<div className="divider" />
						<div className="bottom">
							<p className="rate-message">
								Click to rate
							</p>
							<div className="stars">
								{[1, 2, 3, 4, 5].map(i => {
									const props = {
										key: i,
										onClick: () =>
											uid && deck.rate(
												uid,
												rating === i ? null : i as any
											)
									}
									
									return rating >= i
										? <FilledStar {...props} />
										: <OutlinedStar {...props} />
								})}
							</div>
						</div>
					</>
				)}
			</Control>
			<Control title="Info" className="info">
				<div>
					<p>Active users</p>
					<p>{formatNumber(deck.numberOfCurrentUsers)}</p>
				</div>
				<div>
					<p>All-time users</p>
					<p>{formatNumber(deck.numberOfAllTimeUsers)}</p>
				</div>
				<div>
					<p>Favorites</p>
					<p>{formatNumber(deck.numberOfFavorites)}</p>
				</div>
				<div>
					<p>Last updated</p>
					<p>{timeAgo.format(deck.lastUpdated)}</p>
				</div>
				<div>
					<p>Date created</p>
					<p>{moment(deck.created).format('MMM D, YYYY')}</p>
				</div>
			</Control>
		</div>
	)
}