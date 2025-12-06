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

export function SignUpFormEmployee() {

  return (
    <div className="flex flex-col items-start w-full h-fit gap-8">

      <FieldGroup className="w-full">
        <Field>
          <FieldLabel htmlFor="fullName">Full name</FieldLabel>
          <FieldContent>
            <Input id="fullName" placeholder="Full name" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <FieldContent>
            <Input id="email" type="email" placeholder="Placeholder" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <FieldContent>
            <Input id="password" type="password" placeholder="Enter your password" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <FieldContent>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
            />
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex items-center gap-2 self-stretch">
        <input
          id="agree"
          type="checkbox"
          className="inline-flex items-center justify-center rounded-[8px] border-4 border-primary/80 size-4"
        />
        <div className="flex items-center gap-2">
          <p className="text-base text-[#21212c]">By signing up, you agree to our</p>
          <a href="#" className="text-base text-[#006be5] underline">
            Term of Service
          </a>
          <p className="text-base text-[#21212c]">and</p>
          <a href="#" className="text-base text-[#006be5] underline">
            Privacy Policy
          </a>
        </div>
      </div>

      <div className="flex items-center w-full h-fit justify-center">
        <Button variant="default" size="default" className="w-full h-12">
          Create Account
        </Button>
      </div>
    </div>
  )
}
