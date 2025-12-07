"use client"

import { useState } from "react"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function ForgotPasswordForm() {
  return (
    <div className="flex flex-col items-start w-full h-fit gap-8">
        
      <p className="w-full text-left text-base text-black">Enter your account’s email address.<br></br>We will use this address to send you a verification code.</p>
      <FieldGroup>
        <FieldSet>
          <Field>
            <FieldContent>
              <Input type="email" placeholder="Enter your email" />
            </FieldContent>
          </Field>
        </FieldSet>
      </FieldGroup>

      <div className="flex items-center w-full h-fit justify-center">
        <Button variant="default" size="default" className="w-full h-12">
          Send verification code
        </Button>
      </div>
    </div>
  )
}