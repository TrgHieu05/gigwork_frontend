import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"flex items-center justify-center rounded-sm px-4 text-md font-medium",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
				outline: "border border-primary text-primary bg-transparent hover:bg-primary/10 active:bg-background/10",
				destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
			},

			size: {
				default: "h-9",
				small:"h-7",
			}
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
)

function Button({
	variant,
	size,
	className,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants>) {
	return (
		<button
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		/>
	)
}

export { Button, buttonVariants }