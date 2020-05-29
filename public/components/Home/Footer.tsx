import React from 'react'

import AppStoreDownloadButton from '../shared/AppStoreDownloadButton'
import Logo, { LogoType } from '../shared/Logo'

import '../../scss/components/Home/Footer.scss'

export default () => (
	<footer className="footer">
		<div className="background" />
		<div className="content">
			<div className="top">
				<h1 className="text">
					Download the ultimate<br />
					memorization app
				</h1>
				<AppStoreDownloadButton />
			</div>
			<div className="bottom">
				<Logo type={LogoType.Capital} />
				<p>
					Copyright &copy; 2020 <b>memorize.ai Inc</b>.
					All rights reserved
				</p>
			</div>
		</div>
	</footer>
)