import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import useCurrentUser from '../../../hooks/useCurrentUser'
import useDecks from '../../../hooks/useDecks'
import useRecommendedDecks from '../../../hooks/useRecommendedDecks'
import Head from '../../shared/Head'
import Activity from '../../shared/Activity'
import OwnedDeckCell from '../../shared/DeckCell/Owned'
import DeckCell from '../../shared/DeckCell'
import { formatNumber } from '../../../utils'

import '../../../scss/components/Dashboard/Home.scss'

const DashboardHomeContent = () => {
	const [currentUser] = useCurrentUser()
	
	const [decks] = useDecks()
	const recommendedDecks = useRecommendedDecks(20)
	
	const dueCards = useMemo(() => (
		decks.reduce((acc, deck) => (
			acc + (deck.userData?.numberOfDueCards ?? 0)
		), 0)
	), [decks])
	
	const decksByCardsDue = useMemo(() => (
		decks.sort((a, b) =>
			(b.userData?.numberOfDueCards ?? 0) - (a.userData?.numberOfDueCards ?? 0)
		)
	), [decks])
	
	return (
		<>
			<Head
				title="memorize.ai"
				breadcrumbs={[
					[
						{
							name: 'Dashboard',
							url: window.location.href
						}
					]
				]}
			/>
			<div className="header">
				<div className="left">
					<h1 className="title">
						Hello, {currentUser?.name}
					</h1>
					<h3 className="subtitle">
						You have {dueCards ? formatNumber(dueCards) : 'no'} card{dueCards === 1 ? '' : 's'} due
					</h3>
					{dueCards > 0 && (
						<Link to="/review" className="review-button">
							Review all
						</Link>
					)}
				</div>
				<Link to="/new" className="create-deck-link">
					<FontAwesomeIcon icon={faPlus} />
					<p>Create deck</p>
				</Link>
			</div>
			<div className="activity-container">
				<h1>Activity</h1>
				<Activity />
			</div>
			{decks.length === 0 || (
				<div className="my-decks">
					<h1>My decks</h1>
					<div className="decks">
						<div>
							{decksByCardsDue
								.filter((_, i) => !(i & 1))
								.map(deck => (
									<OwnedDeckCell key={deck.id} deck={deck} />
								))
							}
						</div>
						<div>
							{decksByCardsDue
								.filter((_, i) => i & 1)
								.map(deck => (
									<OwnedDeckCell key={deck.id} deck={deck} />
								))
							}
						</div>
					</div>
				</div>
			)}
			{recommendedDecks.length === 0 || (
				<div className="recommended-decks">
					<h1>Recommended decks</h1>
					<div className="decks">
						<div>
							{recommendedDecks
								.filter((_, i) => !(i & 1))
								.map(deck => (
									<DeckCell key={deck.id} deck={deck} />
								))
							}
						</div>
						<div>
							{recommendedDecks
								.filter((_, i) => i & 1)
								.map(deck => (
									<DeckCell key={deck.id} deck={deck} />
								))
							}
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default DashboardHomeContent
