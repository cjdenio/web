import React, { lazy } from 'react'

import Dashboard, { DashboardNavbarSelection as Selection } from '..'

const Content = lazy(() => import('./Content'))

const DashboardHome = () => (
	<Dashboard selection={Selection.Home} className="home">
		<Content />
	</Dashboard>
)

export default DashboardHome
