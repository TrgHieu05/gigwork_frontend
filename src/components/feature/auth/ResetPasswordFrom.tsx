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

export function ResetPasswordForm() {
  return (
    <div className="flex flex-col items-start w-full h-fit gap-8">
      <FieldGroup>
        <FieldSet>
          <Field>
            <FieldLabel>New password</FieldLabel>
            <FieldContent>
              <Input type="password" placeholder="Enter your new password"/>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Confirm password</FieldLabel>
            <FieldContent>
              <Input type="password" placeholder="Repeat your new password"/>
            </FieldContent>
          </Field>
        </FieldSet>
      </FieldGroup>

      <div className="flex items-center w-full h-fit justify-center">
        <Button variant="default" size="default" className="w-full h-12">
          Done
        </Button>
      </div>
    </div>
  )
}