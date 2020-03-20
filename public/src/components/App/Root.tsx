import React from 'react'
import Helmet from 'react-helmet'

import LoadingState from '../../models/LoadingState'
import useCurrentUser from '../../hooks/useCurrentUser'
import TopGradient from '../shared/TopGradient'
import Home from '../Home'
import Dashboard from '../Dashboard'

export default () => {
	const [currentUser, currentUserLoadingState] = useCurrentUser()
	
	return (
		<div className="min-h-screen bg-light-gray">
			<Helmet>
				<meta name="description" content="The ultimate memorization tool. Download on the App Store" />
				<title>memorize.ai</title>
			</Helmet>
			<TopGradient>
				{currentUserLoadingState === LoadingState.Loading
					? null
					: currentUser ? <Dashboard /> : <Home />
				}
			</TopGradient>
		</div>
	)
}