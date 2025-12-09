'use client'

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import Image from "next/image"

interface roleSelectorProps<> {
  onSelect: () => void
  icon: React.ReactNode
  active: boolean
  role: "recruiter" | "employee"
  description: string
}

const roleSelectorVariants = cva(
  "flex flex-col items-center justify-center rounded-md px-6 py-4",
  {
    variants: {
      active: {
        true: "bg-primary text-primary-foreground",
        false: "bg-card border border-border text-foreground",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

function RoleSelector({
  onSelect,
  active,
  icon,
  role,
  description,
  ...props
}: roleSelectorProps &
  VariantProps<typeof roleSelectorVariants>) {
  return (
    <button
      onClick={onSelect}
      className={cn(roleSelectorVariants({ active }), "w-full flex flex-col items-start justify-center gap-1")}
      {...props}
    >
      <div className="flex flex-row items-center justify-start gap-2 w-full">
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div className="text-md font-medium">{role}</div>
      </div>
      <div className="text-xs ">{description}</div>
    </button>
  )
}

export { RoleSelector, roleSelectorVariants }

