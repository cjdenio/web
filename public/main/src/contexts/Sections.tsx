import React, { createContext, Dispatch, PropsWithChildren, useReducer } from 'react'

import Action, { ActionType } from '../actions/Action'
import Section from '../models/Section'

export type SectionsState = Record<string, Section[]>

export type SectionsAction = Action<
	| { deckId: string, snapshots: firebase.firestore.DocumentSnapshot[] } // AddSection
	| { deckId: string, snapshot: firebase.firestore.DocumentSnapshot } // UpdateSection
	| { deckId: string, sectionId: string } // RemoveSection
>

const initialState: SectionsState = {}

const reducer = (state: SectionsState, { type, payload }: SectionsAction) => {
	switch (type) {
		case ActionType.AddSections: {
			const { deckId, snapshots } = payload as {
				deckId: string
				snapshots: firebase.firestore.DocumentSnapshot[]
			}
			
			return {
				...state,
				[deckId]: Section.sort([
					...(state[deckId] ?? []),
					...snapshots.map(Section.fromSnapshot)
				])
			}
		}
		case ActionType.UpdateSection: {
			const { deckId, snapshot } = payload as {
				deckId: string
				snapshot: firebase.firestore.DocumentSnapshot
			}
			
			return {
				...state,
				[deckId]: Section.sort(
					state[deckId]?.map(section =>
						section.id === snapshot.id
							? section.updateFromSnapshot(snapshot)
							: section
					)
				)
			}
		}
		case ActionType.RemoveSection: {
			const { deckId, sectionId } = payload as {
				deckId: string
				sectionId: string
			}
			
			return {
				...state,
				[deckId]: state[deckId]?.filter(section =>
					section.id !== sectionId
				)
			}
		}
		default:
			return state
	}
}

const Context = createContext<[SectionsState, Dispatch<SectionsAction>]>([
	initialState,
	console.log
])
export default Context

export const SectionsProvider = ({ children }: PropsWithChildren<{}>) => (
	<Context.Provider value={useReducer(reducer, initialState)}>
		{children}
	</Context.Provider>
)
