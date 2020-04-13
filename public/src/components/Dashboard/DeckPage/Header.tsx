import React, { useState, useCallback } from 'react'
import { useHistory, Link } from 'react-router-dom'
import CopyToClipboard from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faLink } from '@fortawesome/free-solid-svg-icons'

import User from '../../../models/User'
import Deck from '../../../models/Deck'
import LoadingState from '../../../models/LoadingState'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useImageUrl from '../../../hooks/useImageUrl'
import useAuthModal from '../../../hooks/useAuthModal'
import Button from '../../shared/Button'
import Stars from '../../shared/Stars'
import Modal from '../../shared/Modal'
import { urlWithQuery, formatNumber } from '../../../utils'

import { ReactComponent as UserIcon } from '../../../images/icons/user.svg'
import { ReactComponent as ShareIcon } from '../../../images/icons/share.svg'
import { ReactComponent as DownloadIcon } from '../../../images/icons/download.svg'
import { ReactComponent as UsersIcon } from '../../../images/icons/users.svg'

export default (
	{ deck, hasDeck }: {
		deck: Deck
		hasDeck: boolean
	}
) => {
	const history = useHistory()
	
	const [currentUser] = useCurrentUser()
	const [imageUrl] = useImageUrl(deck)
	
	const [[, setAuthModalIsShowing], [, setAuthModalCallback]] = useAuthModal()
	
	const [getLoadingState, setGetLoadingState] = useState(LoadingState.None)
	const [isShareModalShowing, setIsShareModalShowing] = useState(false)
	const [didCopyShareLink, setDidCopyShareLink] = useState(false)
	
	const get = useCallback(() => {
		const callback = async (user: User) => {
			try {
				setGetLoadingState(LoadingState.Loading)
				
				await deck[hasDeck ? 'remove' : 'get'](user.id)
				
				setGetLoadingState(LoadingState.Success)
				
				history.push(urlWithQuery(`/decks/${deck.slug}`, {
					new: '1'
				}))
			} catch (error) {
				setGetLoadingState(LoadingState.Fail)
				
				alert(error.message)
				console.error(error)
			}
		}
		
		if (currentUser)
			callback(currentUser)
		else {
			setAuthModalIsShowing(true)
			setAuthModalCallback(callback)
		}
	}, [setAuthModalIsShowing, setAuthModalCallback, currentUser, deck, hasDeck, history])
	
	return (
		<div className="header">
			<img src={imageUrl ?? Deck.DEFAULT_IMAGE_URL} alt={deck.name} />
			<div className="content">
				<div className="top">
					<div className="left">
						<h1 className="name">
							{deck.name}
						</h1>
						<p className="subtitle">
							{deck.subtitle}
						</p>
						{(deck.creatorName = '...') && (
							<div className="creator">
								<UserIcon />
								<p>{deck.creatorName}</p>
							</div>
						)}
					</div>
					<div className="right">
						{hasDeck
							? (
								<>
									<Button
										className="remove"
										loaderSize="16px"
										loaderThickness="3px"
										loaderColor="white"
										loading={getLoadingState === LoadingState.Loading}
										disabled={false}
										onClick={get}
									>
										Remove
									</Button>
									<Link to={`/decks/${deck.slug}`} className="open">
										Open
									</Link>
								</>
							)
							: (
								<Button
									className="get"
									loaderSize="16px"
									loaderThickness="3px"
									loaderColor="white"
									loading={getLoadingState === LoadingState.Loading}
									disabled={false}
									onClick={get}
								>
									Get
								</Button>
							)
						}
						<button
							className="share"
							onClick={() => setIsShareModalShowing(true)}>
							<ShareIcon />
						</button>
					</div>
				</div>
				<div className="divider" />
				<div className="stats">
					<a className="rating" href="#ratings">
						<Stars>{deck.averageRating}</Stars>
						<p>({formatNumber(deck.numberOfRatings)})</p>
					</a>
					<div className="divider" />
					<a className="downloads" href="#info">
						<DownloadIcon />
						<p>({formatNumber(deck.numberOfDownloads)})</p>
					</a>
					<div className="divider" />
					<a className="current-users" href="#info">
						<UsersIcon />
						<p>({formatNumber(deck.numberOfCurrentUsers)})</p>
					</a>
					<div className="divider" />
					<a className="cards" href="#cards">
						{formatNumber(deck.numberOfCards)} card{deck.numberOfCards === 1 ? '' : 's'}
					</a>
				</div>
			</div>
			<Modal
				className="share-deck"
				isShowing={isShareModalShowing}
				setIsShowing={setIsShareModalShowing}
			>
				<div className="header">
					<h2 className="title">
						{currentUser?.id === deck.creatorId
							? 'Promote your deck!'
							: 'Like this deck? Share it!'
						}
					</h2>
					<button
						className="hide"
						onClick={() => setIsShareModalShowing(false)}
					>
						<FontAwesomeIcon icon={faTimesCircle} />
					</button>
				</div>
				<div className="content">
					<div className="box">
						<FontAwesomeIcon icon={faLink} />
						<p>https://memorize.ai/d/{deck.slug}</p>
					</div>
					<CopyToClipboard text={`https://memorize.ai/d/${deck.slug}`}>
						<button
							className="copy"
							onClick={() => setDidCopyShareLink(true)}
						>
							{didCopyShareLink ? 'Copied!' : 'Copy'}
						</button>
					</CopyToClipboard>
				</div>
			</Modal>
		</div>
	)
}
