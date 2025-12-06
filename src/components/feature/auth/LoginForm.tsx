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
import Link from "next/link"

export default function LoginForm() {
  return (
    <div className="flex flex-col items-start w-full h-fit gap-8">
      <FieldGroup>
        <FieldSet>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <FieldContent>
              <Input type="email" placeholder="Enter your email" />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Password</FieldLabel>
            <FieldContent>
              <Input type="password" placeholder="Enter your password" />
            </FieldContent>
          </Field>
        </FieldSet>
      </FieldGroup>

      <div className="flex items-center w-full h-fit justify-center">
        <Button variant="default" size="default" className="w-full h-12">
          Sign in
        </Button>
      </div>

      <Link href="/signup" className=" w-full text-right text-base text-primary underline">
        Forgot password ?
      </Link>
    </div>
  )
}