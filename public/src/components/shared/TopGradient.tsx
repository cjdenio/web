import React, { HTMLAttributes } from 'react'

export default ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
	<div {...props} className="stack">
		<div className="top-gradient origin-top-right" />
		<div className="z-10">{children}</div>
	</div>
)