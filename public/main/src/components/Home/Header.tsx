import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple } from '@fortawesome/free-brands-svg-icons'

import AuthButton from './WhiteArrowAuthButton'
import Screenshot, { ScreenshotType } from '../shared/Screenshot'
import { APP_STORE_URL, IS_IOS_HANDHELD } from '../../constants'

import '../../scss/components/Home/Header.scss'

const HomeHeader = () => (
	<div className="header">
		<div className="left">
			<h1>
				The ultimate<br />
				memorization tool
			</h1>
			<h3>
				We use <b>AI</b> to accurately predict when you need to review.
				Welcome to efficient and effective memorization.
			</h3>
			<div className="footer">
				<AuthButton className="join-button">
					Get started
				</AuthButton>
				{IS_IOS_HANDHELD || (
					<a
						className="app-store"
						href={APP_STORE_URL}
						rel="nofollow noreferrer noopener"
					>
						<FontAwesomeIcon icon={faApple} />
						<p>Download</p>
					</a>
				)}
			</div>
		</div>
		<Screenshot type={ScreenshotType.Review} className="screenshot" />
	</div>
)

export default HomeHeader
