import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './Home'
import UnlockSection from './UnlockSection'

export default () => (
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/d/:deckId/s/:sectionId/u" component={UnlockSection} />
		</Switch>
	</BrowserRouter>
)