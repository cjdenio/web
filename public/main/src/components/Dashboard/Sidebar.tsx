import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import LoadingState from '../../models/LoadingState'
import useAuthState from '../../hooks/useAuthState'
import useDecks from '../../hooks/useDecks'
import useCurrentUser from '../../hooks/useCurrentUser'
import Logo, { LogoType } from '../shared/Logo'
import Input from '../shared/Input'
import Section from './SidebarSection'
import { isNullish, formatNumber, formatNumberAsInt } from '../../utils'

import '../../scss/components/Dashboard/Sidebar.scss'

const DashboardSidebar = () => {
	const isSignedIn = useAuthState()
	
	const [decks, decksLoadingState] = useDecks()
	const [currentUser] = useCurrentUser()
	
	const [query, setQuery] = useState('')
	
	const isLevelLoading = isSignedIn && isNullish(currentUser?.level)
	
	const level = isLevelLoading ? '...' : formatNumberAsInt(currentUser?.level ?? 0)
	const nextLevel = isLevelLoading ? '...' : formatNumberAsInt((currentUser?.level ?? 0) + 1)
	const xp = isSignedIn && isNullish(currentUser?.xp) ? '...' : formatNumber(currentUser?.xp ?? 0)
	
	const sliderPercent = (currentUser?.percentToNextLevel ?? 0) * 100
	
	const hasNoDecks = !isSignedIn || (
		(decksLoadingState === LoadingState.Success) &&
		!decks.length
	)
	
	const dueDecks = useMemo(() => (
		(decks ?? [])
			.filter(deck => deck.userData?.isDue ?? false)
			.sort((a, b) =>
				(b.userData?.numberOfDueCards ?? 0) - (a.userData?.numberOfDueCards ?? 0)
			)
	), [decks])
	
	const favoriteDecks = useMemo(() => (
		(decks ?? [])
			.filter(deck => deck.userData?.isFavorite ?? false)
			.sort((a, b) => a.name.localeCompare(b.name))
	), [decks])
	
	const allDecks = useMemo(() => (
		(decks ?? []).sort((a, b) => a.name.localeCompare(b.name))
	), [decks])
	
	return (
		<div className="sidebar">
			<div className="top">
				<Link to="/">
					<Logo type={LogoType.Capital} />
				</Link>
				<div className="divider" />
				<Input
					icon={faSearch}
					type="name"
					placeholder="My decks"
					value={query}
					setValue={setQuery}
				/>
			</div>
			<div className="sections">
				{hasNoDecks
					? <p>Go on. Explore!</p>
					: (
						<>
							<Section
								title="Due"
								decks={dueDecks}
								query={query}
								includesDivider
							/>
							<Section
								title="Favorites"
								decks={favoriteDecks}
								query={query}
								includesDivider
							/>
							<Section
								title="All"
								decks={allDecks}
								query={query}
							/>
						</>
					)
				}
			</div>
			<div
				className="bottom"
				aria-label="Earn XP by gaining popularity on your decks"
				data-balloon-pos="up"
			>
				<div className="divider" />
				<div className="content">
					<p className="stats">
						<span className="level">lvl {level}</span>&nbsp;
						<span className="bullet">&bull;</span>&nbsp;
						<span className="xp">{xp} xp</span>
					</p>
					<div className="level-container">
						<div className="slider">
							<div style={{ width: `${sliderPercent}%` }} />
						</div>
						<p className="level">lvl {nextLevel}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default DashboardSidebar
