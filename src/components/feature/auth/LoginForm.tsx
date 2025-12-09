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
import { Briefcase, User } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showRoleSelection, setShowRoleSelection] = useState(false)
  const [userRoles, setUserRoles] = useState<{ isWorker: boolean; isEmployer: boolean }>({ isWorker: false, isEmployer: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await authService.login({ email, password })

      // Check if user has both roles
      if (response.user.isWorker && response.user.isEmployer) {
        setUserRoles({ isWorker: true, isEmployer: true })
        setShowRoleSelection(true)
        setIsLoading(false)
        return
      }

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
      setIsLoading(false)
    }
  }

  const handleRoleSelect = (role: "employee" | "employer") => {
    // Save selected role to localStorage for session
    localStorage.setItem("selectedRole", role)

    if (role === "employee") {
      router.push("/employee/dashboard")
    } else {
      router.push("/employer/dashboard")
    }
  }

  // Role selection screen for users with both roles
  if (showRoleSelection) {
    return (
      <div className="flex flex-col items-center w-full h-fit gap-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Choose Your Role</h2>
          <p className="text-muted-foreground text-sm">
            You have access to both employee and employer features. Select a role to continue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={() => handleRoleSelect("employee")}
            className="flex flex-col items-center gap-3 p-6 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <span className="font-semibold">Continue as Employee</span>
            <span className="text-sm text-muted-foreground text-center">
              Find and apply for jobs
            </span>
          </button>

          <button
            onClick={() => handleRoleSelect("employer")}
            className="flex flex-col items-center gap-3 p-6 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Briefcase className="h-8 w-8 text-green-600" />
            </div>
            <span className="font-semibold">Continue as Employer</span>
            <span className="text-sm text-muted-foreground text-center">
              Post jobs and hire workers
            </span>
          </button>
        </div>
      </div>
    )
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