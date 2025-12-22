"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authService, getErrorMessage } from "@/services/auth"

// Schema validation with Zod - simplified for registration only
const signUpEmployeeSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms of service",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignUpEmployeeValues = z.infer<typeof signUpEmployeeSchema>

export function SignUpFormEmployee() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpEmployeeValues>({
    resolver: zodResolver(signUpEmployeeSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  const onSubmit = async (data: SignUpEmployeeValues) => {
    setIsLoading(true)
    setError(null)

    try {
      // Call API with isWorker=true for employee role
      await authService.register({
        email: data.email,
        password: data.password,
        isWorker: true,
        isEmployer: false,
      })

      // Send verification email
      try {
        await authService.sendVerification()
      } catch (verificationError) {
        console.error("Failed to send verification email:", verificationError)
        alert("Account created successfully, but we encountered an issue sending the verification email. Please request a new verification link from your profile page.")
      }

      // Redirect to setup profile page
      router.push("/setup-profile")
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-start w-full h-fit gap-8"
    >
      {/* Error message */}
      {error && (
        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <FieldGroup className="w-full">
        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <FieldContent>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <FieldContent>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex flex-col gap-2 self-stretch">
        <div className="flex items-center gap-2">
          <input
            id="agree"
            type="checkbox"
            className="inline-flex items-center justify-center rounded-[8px] border-4 border-primary/80 size-4"
            {...register("terms")}
          />
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-base text-[#21212c]">
              By signing up, you agree to our
            </p>
            <a href="#" className="text-base text-[#006be5] underline">
              Term of Service
            </a>
            <p className="text-base text-[#21212c]">and</p>
            <a href="#" className="text-base text-[#006be5] underline">
              Privacy Policy
            </a>
          </div>
        </div>
        {errors.terms && (
          <p className="text-red-500 text-sm">{errors.terms.message}</p>
        )}
      </div>

      <div className="flex items-center w-full h-fit justify-center">
        <Button
          type="submit"
          variant="default"
          size="default"
          className="w-full h-12"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </form>
  )
}
