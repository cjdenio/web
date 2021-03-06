import chunk from 'lodash/chunk'

import firebase from '../firebase'
import User from './User'
import Deck from './Deck'
import { CardDraft } from './Card'
import { handleError } from '../utils'
import { FIRESTORE_BATCH_LIMIT } from '../constants'

import 'firebase/firestore'

const { FieldValue } = firebase.firestore
const firestore = firebase.firestore()

export interface SectionData {
	name: string
	index: number
	numberOfCards: number
}

export default class Section implements SectionData {
	static observers: Record<string, boolean> = {}
	
	id: string
	name: string
	index: number
	numberOfCards: number
	
	constructor(id: string, data: SectionData) {
		this.id = id
		this.name = data.name
		this.index = data.index
		this.numberOfCards = data.numberOfCards
	}
	
	static fromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) =>
		new Section(snapshot.id, {
			name: snapshot.get('name') ?? '(error)',
			index: snapshot.get('index') ?? 0,
			numberOfCards: snapshot.get('cardCount') ?? 0
		})
	
	static newUnsectionedSection = (numberOfCards: number) =>
		new Section('', {
			name: 'Unsectioned',
			index: -1,
			numberOfCards
		})
	
	static observeForDeckWithId = (
		deckId: string,
		{ addSections, updateSection, removeSection }: {
			addSections: (deckId: string, snapshots: firebase.firestore.DocumentSnapshot[]) => void
			updateSection: (deckId: string, snapshot: firebase.firestore.DocumentSnapshot) => void
			removeSection: (deckId: string, sectionId: string) => void
		}
	) =>
		firestore.collection(`decks/${deckId}/sections`).onSnapshot(
			snapshot => {
				const snapshots: firebase.firestore.DocumentSnapshot[] = []
				
				for (const { type, doc } of snapshot.docChanges())
					switch (type) {
						case 'added':
							snapshots.push(doc)
							break
						case 'modified':
							updateSection(deckId, doc)
							break
						case 'removed':
							removeSection(deckId, doc.id)
							break
					}
				
				addSections(deckId, snapshots)
			},
			handleError
		)
	
	static createForDeck = async (deck: Deck, name: string, numberOfSections: number) =>
		(await firestore
			.collection(`decks/${deck.id}/sections`)
			.add({
				name,
				index: numberOfSections,
				cardCount: 0
			})
		).id
	
	static sort = (sections: Section[]) =>
		sections.sort(({ index: a }, { index: b }) => a - b)
	
	get isUnsectioned() {
		return !this.id
	}
	
	updateFromSnapshot = (snapshot: firebase.firestore.DocumentSnapshot) => {
		this.name = snapshot.get('name')
		this.index = snapshot.get('index')
		this.numberOfCards = snapshot.get('cardCount') ?? 0
		
		return this
	}
	
	rename = (deck: Deck, name: string) =>
		firestore.doc(`decks/${deck.id}/sections/${this.id}`).update({ name })
	
	delete = (deck: Deck) =>
		firestore.doc(`decks/${deck.id}/sections/${this.id}`).delete()
	
	publishCards = (user: User, deck: Deck, cards: CardDraft[]) => {
		const chunks = chunk(cards, FIRESTORE_BATCH_LIMIT)
		
		const promises: Promise<any>[] = chunks.map(chunk => {
			const batch = firestore.batch()
			
			for (const { front, back } of chunk)
				batch.set(firestore.collection(`decks/${deck.id}/cards`).doc(), {
					section: this.id,
					front,
					back,
					viewCount: 0,
					reviewCount: 0,
					skipCount: 0
				})
			
			return batch.commit()
		})
		
		if (deck.isSectionUnlocked(this))
			promises.push(
				firestore.doc(`users/${user.id}/decks/${deck.id}`).update({
					dueCardCount: FieldValue.increment(1),
					[this.isUnsectioned
						? 'unsectionedDueCardCount'
						: `sections.${this.id}`
					]: FieldValue.increment(1)
				})
			)
		
		return Promise.all(promises)
	}
}
