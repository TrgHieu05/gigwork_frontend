import * as React from "react"

import { cn } from "@/lib/utils"

interface TextareaProps extends React.ComponentProps<"textarea"> { }

function Textarea({ className, ...props }: TextareaProps) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-[120px] w-full min-w-0 rounded-md border bg-background px-3 py-2 text-base transition-[color,box-shadow] outline-none resize-y disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-primary/80 focus-visible:ring-2",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    )
}

export { Textarea }
