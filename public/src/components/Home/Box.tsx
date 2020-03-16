import React, { HTMLAttributes } from 'react'

export interface BoxProps {
	image: string
	title: string
	description: string
	index: number
}

export default ({ image, title, description, index, ...props }: BoxProps & HTMLAttributes<HTMLDivElement>) => (
	<div
		{...props}
		className="z-10 text-dark-gray bg-white shadow-sm shadow-raise-on-hover"
		data-aos="flip-up"
		data-aos-anchor="#home-boxes-aos-anchor"
		data-aos-delay={index * 100}
	>
		<img src={image} alt={title} />
		<h1 className="mt-4">{title}</h1>
		<p className="hidden mt-2">{description}</p>
	</div>
)