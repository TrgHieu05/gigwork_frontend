"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { authService, getErrorMessage } from "@/services/auth"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await authService.login({ email, password })

      // Redirect based on user role
      if (response.user.isWorker) {
        router.push("/employee/dashboard")
      } else if (response.user.isEmployer) {
        router.push("/employer/dashboard")
      } else {
        router.push("/")
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start w-full h-fit gap-8">
      {error && (
        <div className="w-full p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}

      <FieldGroup>
        <FieldSet>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <FieldContent>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Password</FieldLabel>
            <FieldContent>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </FieldContent>
          </Field>
        </FieldSet>
      </FieldGroup>

      <div className="flex items-center w-full h-fit justify-center">
        <Button
          type="submit"
          variant="default"
          size="default"
          className="w-full h-12"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </div>

      <Link href="/forgot-password" className=" w-full text-right text-base text-primary underline">
        Forgot password ?
      </Link>
    </form>
  )
}