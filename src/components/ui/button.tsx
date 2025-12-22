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
				ghost: "hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			},

			size: {
				default: "h-9",
				small: "h-7",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				icon: "h-9 w-9",
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