import React, { PropsWithChildren, useEffect, Suspense } from 'react'
import cx from 'classnames'

import hideChat from '../../hooks/hideChat'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

import '../../scss/components/Dashboard/index.scss'

export enum DashboardNavbarSelection {
	Home = 'Home',
	Market = 'Market',
	Decks = 'Decks',
	Interests = 'Interests'
}

export enum DashboardGradientStyle {
	Blue = 'blue',
	Green = 'green'
}

export interface DashboardProps {
	selection: DashboardNavbarSelection
	gradientStyle?: DashboardGradientStyle
	isNavbarHidden?: boolean
	hideChat?: boolean
	className: string
}

const Dashboard = ({
	selection,
	gradientStyle = DashboardGradientStyle.Blue,
	isNavbarHidden = false,
	hideChat: shouldHideChat = false,
	className,
	children
}: PropsWithChildren<DashboardProps>) => {
	hideChat(shouldHideChat)
	
	useEffect(() => {
		const { body } = document
		
		body.classList.add('clipped')
		
		return () => body.classList.remove('clipped')
	}, [])
	
	return (
		<div className={cx('dashboard', className)}>
			<Sidebar />
			<div className="content">
				<div className={`background ${gradientStyle}-gradient`} />
				<div className={cx('container', { 'navbar-hidden': isNavbarHidden })}>
					<Navbar selection={selection} />
					<div className="foreground">
						<Suspense fallback={null}>
							{children}
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Dashboard
