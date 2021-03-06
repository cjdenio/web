import React, { lazy, Suspense } from 'react'

import Policy from '../shared/Policy'

const Content = lazy(() => import('./Content'))

const Support = () => (
	<Policy
		id="support"
		title="Support"
		description="Contact memorize.ai's support by emailing support@memorize.ai."
	>
		<Suspense fallback={null}>
			<Content />
		</Suspense>
	</Policy>
)

export default Support
