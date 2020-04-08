export default interface Action<Payload> {
	type: ActionType
	payload: Payload
}

export enum ActionType {
	SetCurrentUser = 'SET_CURRENT_USER',
	UpdateCurrentUser = 'UPDATE_CURRENT_USER',
	SetCurrentUserLoadingState = 'SET_CURRENT_USER_LOADING_STATE',
	SetIsObservingCurrentUser = 'SET_IS_OBSERVING_CURRENT_USER',
	
	SetSelectedDeck = 'SET_SELECTED_DECK',
	UpdateDeck = 'UPDATE_DECK',
	UpdateOwnedDeck = 'UPDATE_OWNED_DECK',
	UpdateDeckUserData = 'UPDATE_DECK_USER_DATA',
	RemoveDeck = 'REMOVE_DECK',
	RemoveOwnedDeck = 'REMOVE_OWNED_DECK',
	
	SetDeckImageUrl = 'SET_DECK_IMAGE_URL',
	SetDeckImageUrlLoadingState = 'SET_DECK_IMAGE_URL_LOADING_STATE',
	
	InitializeSections = 'INITIALIZE_SECTIONS',
	AddSection = 'ADD_SECTION',
	UpdateSection = 'UPDATE_SECTION',
	RemoveSection = 'REMOVE_SECTION',
	
	InitializeCards = 'INITIALIZE_CARDS',
	AddCard = 'ADD_CARD',
	UpdateCard = 'UPDATE_CARD',
	UpdateCardUserData = 'UPDATE_CARD_USER_DATA',
	RemoveCard = 'REMOVE_CARD',
	
	AddTopic = 'ADD_TOPIC',
	UpdateTopic = 'UPDATE_TOPIC',
	RemoveTopic = 'REMOVE_TOPIC',
	
	SetCreateDeckImage = 'SET_CREATE_DECK_IMAGE',
	SetCreateDeckName = 'SET_CREATE_DECK_NAME',
	SetCreateDeckSubtitle = 'SET_CREATE_DECK_SUBTITLE',
	SetCreateDeckDescription = 'SET_CREATE_DECK_DESCRIPTION',
	SetCreateDeckTopics = 'SET_CREATE_DECK_TOPICS',
	
	ToggleSectionExpanded = 'TOGGLE_SECTION_EXPANDED',
	
	SetCounterKey = 'SET_COUNTER_KEY'
}
