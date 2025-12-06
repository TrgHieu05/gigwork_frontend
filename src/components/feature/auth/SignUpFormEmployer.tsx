"use client"

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
import { RoleSelector } from "./RoleSelector"
import { Briefcase } from "lucide-react"

export function SignUpFormEmployer() {
  return (
    <div className="relative flex flex-col items-startp-8 w-full h-full gap-8">

      <FieldGroup className="z-20 w-full">
        <Field>
          <FieldLabel htmlFor="orgName">Organization / business name</FieldLabel>
          <FieldContent>
            <Input id="orgName" placeholder="Placeholder" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Phone number</FieldLabel>
          <FieldContent>
            <Input id="phone" type="tel" placeholder="Placeholder" />
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
          className="inline-flex items-center justify-center rounded-[4px] border-2 border-[#e0e0e0] size-4"
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

      <div className="flex items-center self-stretch justify-center z-20">
        <Button variant="default" className="h-12 rounded-md px-6 w-[608px]">
          Create Account
        </Button>
      </div>
    </div>
  )
}
