import React, { PropsWithChildren } from 'react'

const CramRecapModalData = (
	{ title, children }: PropsWithChildren<{ title: string }>
) => (
	<div className="data">
		<p className="title">{title}</p>
		<p className="content">{children}</p>
	</div>
)

export default CramRecapModalData
