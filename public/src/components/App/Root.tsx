import React, { memo } from 'react'

import useAuthState from '../../hooks/useAuthState'
import Home from '../Home'
import DashboardHome from '../Dashboard/Home'

const Root = () => (
	useAuthState() ? <DashboardHome /> : <Home />
)

export default memo(Root)
