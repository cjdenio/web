import React, { useRef, useState, useEffect, useCallback, useContext } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'
import InfiniteScroll from 'react-infinite-scroller'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'
import DeckImageUrlsContext from '../../../contexts/DeckImageUrls'
import useQuery from '../../../hooks/useQuery'
import useSearchState from '../../../hooks/useSearchState'
import useRemoveDeckModal from '../../../hooks/useRemoveDeckModal'
import Deck from '../../../models/Deck'
import DeckSearch, {
	DEFAULT_DECK_SORT_ALGORITHM,
	decodeDeckSortAlgorithm,
	nameForDeckSortAlgorithm,
	DeckSortAlgorithm
} from '../../../models/Deck/Search'
import Counters, { Counter } from '../../../models/Counters'
import Head, { APP_DESCRIPTION } from '../../shared/Head'
import Input from '../../shared/Input'
import SortDropdown from '../../shared/SortDropdown'
import { DropdownShadow } from '../../shared/Dropdown'
import DeckRow from './DeckRow'
import Loader from '../../shared/Loader'
import RemoveDeckModal from '../../shared/Modal/RemoveDeck'
import { urlForDeckPage } from '../DeckPage'
import { urlWithQuery, formatNumber } from '../../../utils'

import '../../../scss/components/Dashboard/Market.scss'

export const urlForMarket = () => {
	const [{ query, sortAlgorithm }] = useSearchState() // eslint-disable-line
	
	return urlWithQuery('/market', {
		q: query,
		s: sortAlgorithm === DEFAULT_DECK_SORT_ALGORITHM
			? null
			: sortAlgorithm
	})
}

export default () => {
	const [imageUrls] = useContext(DeckImageUrlsContext)
	
	const isLoading = useRef(true)
	const scrollingContainerRef = useRef(null as HTMLDivElement | null)
	
	const history = useHistory()
	const searchParams = useQuery()
	
	const [, setSearchState] = useSearchState()
	const [removeDeck, removeDeckModalProps] = useRemoveDeckModal()
	
	const query = searchParams.get('q') ?? ''
	const sortAlgorithm = decodeDeckSortAlgorithm(
		searchParams.get('s') ?? ''
	) ?? DEFAULT_DECK_SORT_ALGORITHM
	
	const [decks, setDecks] = useState([] as Deck[])
	const [isLastPage, setIsLastPage] = useState(false)
	const [isSortDropdownShowing, setIsSortDropdownShowing] = useState(false)
	
	const numberOfDecks = Counters.get(Counter.Decks)
	
	const shouldHideSortAlgorithm = (
		sortAlgorithm === DEFAULT_DECK_SORT_ALGORITHM ||
		sortAlgorithm === DeckSortAlgorithm.Relevance
	)
	
	useEffect(() => {
		isLoading.current = true
		
		setIsLastPage(false)
		
		let shouldContinue = true
		
		getDecks(1).then(decks => {
			if (!shouldContinue)
				return
			
			setDecks(decks)
			isLoading.current = false
			
			const container = scrollingContainerRef.current
			
			if (container)
				container.scrollTop = 0
		})
		
		setSearchState({ query, sortAlgorithm })
		
		return () => {
			shouldContinue = false
			isLoading.current = false
		}
	}, [query, sortAlgorithm]) // eslint-disable-line
	
	const onInputRef = useCallback((input: HTMLInputElement | null) => {
		input?.focus()
	}, [])
	
	const getDecks = async (pageNumber: number) => {
		try {
			const decks = await DeckSearch.search(query, {
				pageNumber,
				pageSize: 40,
				sortAlgorithm,
				filterForTopics: null
			})
			
			if (!decks.length)
				setIsLastPage(true)
			
			return decks
		} catch (error) {
			setIsLastPage(true)
			console.error(error)
			
			return []
		}
	}
	
	const loadMoreDecks = async (pageNumber: number) => {
		if (isLoading.current)
			return
		
		isLoading.current = true
		
		setDecks([...decks, ...await getDecks(pageNumber)])
		
		isLoading.current = false
	}
	
	return (
		<Dashboard selection={Selection.Market} className="market" gradientHeight="500px">
			<Head
				title={
					`${query && `${query} | `}${
						shouldHideSortAlgorithm
							? ''
							: `${nameForDeckSortAlgorithm(sortAlgorithm)} | `
					}memorize.ai Marketplace`
				}
				description={
					`Search the Marketplace${query && ` for ${query}`}${
						shouldHideSortAlgorithm
							? ''
							: ` by ${nameForDeckSortAlgorithm(sortAlgorithm).toLowerCase()}`
					} on memorize.ai. Unlock your true potential by using Artificial Intelligence to help you learn. ${APP_DESCRIPTION}`
				}
				breadcrumbs={[
					[
						{
							name: 'Market',
							url: window.location.href
						}
					]
				]}
				schemaItems={[
					{
						'@type': 'ItemList',
						numberOfItems: decks.length,
						itemListOrder: 'Descending',
						itemListElement: decks.map((deck, i) => ({
							'@type': 'ListItem',
							position: i + 1,
							image: imageUrls[deck.id]?.url ?? Deck.DEFAULT_IMAGE_URL,
							name: deck.name,
							description: deck.description,
							url: `https://memorize.ai${urlForDeckPage(deck)}`
						}))
					}
				]}
			/>
			<div className="header">
				<Link
					className="create"
					to="/new"
					aria-label="Create your own deck!"
					data-balloon-pos="right"
				>
					<FontAwesomeIcon icon={faPlus} />
				</Link>
				<Input
					ref={onInputRef}
					className="search"
					icon={faSearch}
					type="name"
					name="search_term_string"
					placeholder={
						`Explore ${numberOfDecks === null ? '...' : formatNumber(numberOfDecks)} decks`
					}
					value={query}
					setValue={newQuery =>
						history.push(urlWithQuery('/market', {
							q: newQuery,
							s: newQuery
								? sortAlgorithm === DEFAULT_DECK_SORT_ALGORITHM
									? DeckSortAlgorithm.Relevance
									: sortAlgorithm
								: sortAlgorithm === DeckSortAlgorithm.Relevance
									? null
									: sortAlgorithm
						}))
					}
				/>
				<SortDropdown
					shadow={DropdownShadow.Screen}
					isShowing={isSortDropdownShowing}
					setIsShowing={setIsSortDropdownShowing}
					algorithm={sortAlgorithm}
					setAlgorithm={newSortAlgorithm =>
						history.push(urlWithQuery('/market', {
							q: query,
							s: newSortAlgorithm === DEFAULT_DECK_SORT_ALGORITHM
								? null
								: newSortAlgorithm
						}))
					}
				/>
			</div>
			<div ref={scrollingContainerRef} className="decks">
				<InfiniteScroll
					loadMore={loadMoreDecks}
					hasMore={!isLastPage}
					loader={
						<Loader
							key={0}
							size="24px"
							thickness="4px"
							color={decks.length ? '#582efe' : 'white'}
						/>
					}
					useWindow={false}
				>
					{decks.map(deck => (
						<DeckRow
							key={deck.id}
							deck={deck}
							remove={() => removeDeck(deck)}
						/>
					))}
				</InfiniteScroll>
			</div>
			<RemoveDeckModal {...removeDeckModalProps} />
		</Dashboard>
	)
}
