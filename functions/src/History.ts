import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

import Deck from './Deck'
import Setting from './Setting'
import Algorithm from './Algorithm'
import SM2 from './SM2'

const firestore = admin.firestore()

export const historyCreated = functions.firestore.document('users/{uid}/decks/{deckId}/cards/{cardId}/history/{historyId}').onCreate((snapshot, context) => {
	const current = new Date()
	const now = Date.now()
	const cardRef = firestore.doc(`users/${context.params.uid}/decks/${context.params.deckId}/cards/${context.params.cardId}`)
	return cardRef.get().then(card => {
		const rating = snapshot.get('rating')
		const correct = rating > 2
		const increment = correct ? 1 : 0
		if (card.data())
			return Setting.get('algorithm', context.params.uid).then((algorithm: boolean) => {
				const elapsed = now - card.get('last').date.toMillis()
				const streak = correct ? card.get('streak') + 1 : 0
				const e = SM2.e(card.get('e'), rating)
				if (algorithm)
					return allCards(context.params.uid).then(cards => {
						const next = new Date(Algorithm.predict(context.params.cardId, cards))
						return Promise.all([
							cardRef.collection('history').doc(context.params.historyId).update({
								date: current,
								next,
								elapsed
							}),
							cardRef.update({
								count: admin.firestore.FieldValue.increment(1),
								correct: admin.firestore.FieldValue.increment(increment),
								e,
								streak,
								mastered: rating === 5 && streak >= 20,
								last: {
									id: context.params.historyId,
									date: current,
									rating,
									elapsed
								},
								next
							})
						])
					})
				else {
					const next = new Date(now + SM2.interval(e, streak) * 86400000)
					return Promise.all([
						cardRef.collection('history').doc(context.params.historyId).update({
							date: current,
							next,
							elapsed
						}),
						cardRef.update({
							count: admin.firestore.FieldValue.increment(1),
							correct: admin.firestore.FieldValue.increment(increment),
							e,
							streak,
							mastered: rating === 5 && streak >= 20,
							last: {
								id: context.params.historyId,
								date: current,
								rating,
								elapsed
							},
							next
						})
					])
				}
			})
		else {
			const next = new Date(now + rating < 3 ? 0 : 86400000)
			return Promise.all([
				cardRef.collection('history').doc(context.params.historyId).update({
					date: current,
					next,
					elapsed: 0
				}),
				cardRef.set({
					count: 1,
					correct: increment,
					e: 2.5,
					streak: increment,
					mastered: false,
					last: {
						id: context.params.historyId,
						date: current,
						rating,
						elapsed: 0
					},
					next
				})
			])
		}
	})
})

function allCards(uid: string): Promise<{ id: string, intervals: number[], front: string }[]> {
	return firestore.collection(`users/${uid}/decks`).get().then(decks =>
		Promise.all(decks.docs.map(deck =>
			allCardsForDeck(uid, deck.id)
		)).then(lists => lists.flat())
	)
}

function allCardsForDeck(uid: string, deckId: string): Promise<{ id: string, intervals: number[], front: string }[]> {
	return firestore.collection(`users/${uid}/decks/${deckId}/cards`).get().then(cards =>
		Promise.all(cards.docs.map(card =>
			allHistory(uid, deckId, card.id)
		))
	)
}

function allHistory(uid: string, deckId: string, cardId: string): Promise<{ id: string, intervals: number[], front: string }> {
	return firestore.collection(`users/${uid}/decks/${deckId}/cards/${cardId}/history`).get().then(historyDocs =>
		Promise.all(historyDocs.docs.map(history => history.get('elapsed')))
	).then(intervals =>
		Deck.doc(deckId, `cards/${cardId}`).get().then(cardDoc =>
			({ id: cardId, intervals, front: cardDoc.get('front') })
		)
	)
}