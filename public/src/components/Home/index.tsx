import React from 'react'
import Helmet from 'react-helmet'

import TopGradient from '../shared/TopGradient'
import Navbar from './Navbar'
import Header from './Header'
import Boxes from './Boxes'
import Screenshots from './Screenshots'
import Integrations from './Integrations'
import Footer from './Footer'
import firebase from '../../firebase'

import 'firebase/analytics'

const analytics = firebase.analytics()

export default () => {
	analytics.setCurrentScreen('home')
	
	return (
		<div className="bg-light-gray">
			<Helmet>
				<meta name="description" content="The ultimate memorization tool. Download on the App Store" />
				<title>memorize.ai</title>
			</Helmet>
			<TopGradient>
				<Navbar />
				<Header />
				<Boxes />
				<Screenshots />
				<Integrations />
				<Footer />
			</TopGradient>
		</div>
	)
}
