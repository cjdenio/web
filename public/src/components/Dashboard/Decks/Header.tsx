import React, { useState, useCallback, memo } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faStar as faStarFilled, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarOutlined } from '@fortawesome/free-regular-svg-icons'
import cx from 'classnames'

import Deck from '../../../models/Deck'
import useCurrentUser from '../../../hooks/useCurrentUser'
import useImageUrl from '../../../hooks/useImageUrl'
import useRemoveDeckModal from '../../../hooks/useRemoveDeckModal'
import CreateSectionModal from '../../shared/Modal/CreateSection'
import ShareDeckModal from '../../shared/Modal/ShareDeck'
import ConfirmationModal from '../../shared/Modal/Confirmation'
import Dropdown, { DropdownShadow } from '../../shared/Dropdown'
import RemoveDeckModal from '../../shared/Modal/RemoveDeck'
import DownloadAppModal from '../../shared/Modal/DownloadApp'
import { formatNumber } from '../../../utils'

import { ReactComponent as ShareIcon } from '../../../images/icons/share.svg'
import { ReactComponent as CartIcon } from '../../../images/icons/cart.svg'
import { ReactComponent as EditIcon } from '../../../images/icons/edit.svg'

const DecksHeader = ({ deck }: { deck: Deck | null }) => {
	const [currentUser] = useCurrentUser()
	const [imageUrl] = useImageUrl(deck)
	
	const [isCreateSectionModalShowing, setIsCreateSectionModalShowing] = useState(false)
	const [isShareModalShowing, setIsShareModalShowing] = useState(false)
	const [isDeleteModalShowing, setIsDeleteModalShowing] = useState(false)
	const [isOptionsDropdownShowing, setIsOptionsDropdownShowing] = useState(false)
	const [isDownloadAppModalShowing, setIsDownloadAppModalShowing] = useState(false)
	
	const [removeDeck, removeDeckModalProps] = useRemoveDeckModal()
	const [downloadAppMessage, setDownloadAppMessage] = useState('')
	
	const isFavorite = deck?.userData?.isFavorite ?? false
	const isOwner = currentUser && deck?.creatorId === currentUser.id
	const numberOfDueCards = deck?.userData?.numberOfDueCards ?? 0
	const numberOfDueCardsFormatted = formatNumber(numberOfDueCards)
	
	const onConfirmDelete = useCallback(() => {
		if (!(deck && currentUser))
			return
		
		deck.delete(currentUser.id)
		
		setIsOptionsDropdownShowing(false)
		setIsDeleteModalShowing(false)
	}, [deck, currentUser, setIsOptionsDropdownShowing, setIsDeleteModalShowing])
	
	return (
		<div className={cx('header', { loading: !deck })}>
			<img src={imageUrl ?? Deck.DEFAULT_IMAGE_URL} alt="Deck" />
			<h1 className="name">
				{deck?.name}
			</h1>
			<button
				className="review"
				disabled={!numberOfDueCards}
				onClick={() => {
					setDownloadAppMessage(
						`Download memorize.ai on the App Store to review ${
							numberOfDueCardsFormatted
						} card${numberOfDueCards === 1 ? '' : 's'}!`
					)
					setIsDownloadAppModalShowing(true)
				}}
			>
				Review{numberOfDueCards > 0 && ` ${numberOfDueCardsFormatted} card${numberOfDueCards === 1 ? '' : 's'}`}
			</button>
			{currentUser && currentUser?.id === deck?.creatorId && (
				<button
					className="create-section"
					onClick={() => setIsCreateSectionModalShowing(true)}
				>
					Create section
				</button>
			)}
			<button className="share" onClick={() => setIsShareModalShowing(true)}>
				<ShareIcon />
			</button>
			<Dropdown
				className="options"
				shadow={DropdownShadow.Screen}
				trigger={<FontAwesomeIcon icon={faBars} />}
				isShowing={isOptionsDropdownShowing}
				setIsShowing={setIsOptionsDropdownShowing}
			>
				<button onClick={() => currentUser && deck?.toggleFavorite(currentUser.id)}>
					<FontAwesomeIcon
						icon={isFavorite ? faStarFilled : faStarOutlined}
						className="star"
					/>
					<p>{isFavorite ? 'Unf' : 'F'}avorite ({formatNumber(deck?.numberOfFavorites ?? 0)})</p>
				</button>
				<Link to={`/d/${deck?.slugId ?? ''}/${deck?.slug ?? ''}`}>
					<CartIcon className="cart" />
					<p>Visit page</p>
				</Link>
				{isOwner && (
					<Link to={`/edit/${deck?.slugId ?? ''}/${deck?.slug ?? ''}`}>
						<EditIcon className="edit" />
						<p>Edit deck</p>
					</Link>
				)}
				<div className="divider" />
				<button onClick={() => deck && removeDeck(deck)}>
					<FontAwesomeIcon icon={faTimes} className="destructive remove" />
					<p>Remove from library</p>
				</button>
				{isOwner && (
					<button onClick={() => setIsDeleteModalShowing(true)}>
						<FontAwesomeIcon icon={faTrash} className="destructive delete" />
						<p>Permanently delete</p>
					</button>
				)}
			</Dropdown>
			{deck && (
				<>
					<CreateSectionModal
						deck={deck}
						isShowing={isCreateSectionModalShowing}
						setIsShowing={setIsCreateSectionModalShowing}
					/>
					<ShareDeckModal
						deck={deck}
						isShowing={isShareModalShowing}
						setIsShowing={setIsShareModalShowing}
					/>
					<RemoveDeckModal {...removeDeckModalProps} />
					{isOwner && currentUser && (
						<ConfirmationModal
							title="Permanently delete deck"
							message="Are you sure? You cannot recover this deck."
							onConfirm={onConfirmDelete}
							buttonText="Delete"
							buttonBackground="#e53e3e"
							isShowing={isDeleteModalShowing}
							setIsShowing={setIsDeleteModalShowing}
						/>
					)}
				</>
			)}
			<DownloadAppModal
				message={downloadAppMessage}
				isShowing={isDownloadAppModalShowing}
				setIsShowing={setIsDownloadAppModalShowing}
			/>
		</div>
	)
}

export default memo(DecksHeader)
