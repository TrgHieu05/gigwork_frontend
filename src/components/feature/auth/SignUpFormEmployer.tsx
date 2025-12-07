"use client"

import { useState } from "react"
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

// 1. Định nghĩa schema validation bằng Zod cho Employer
const signUpEmployerSchema = z
  .object({
    orgName: z.string().min(1, "Vui lòng nhập tên tổ chức/doanh nghiệp"),
    phone: z.string().min(10, "Số điện thoại không hợp lệ"),
    email: z.string().email("Địa chỉ email không hợp lệ"),
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "Bạn phải đồng ý với điều khoản sử dụng",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  })

// 2. Định nghĩa kiểu dữ liệu từ schema
type SignUpEmployerValues = z.infer<typeof signUpEmployerSchema>

export function SignUpFormEmployer() {
  const [isLoading, setIsLoading] = useState(false)

  // 3. Khởi tạo form hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpEmployerValues>({
    resolver: zodResolver(signUpEmployerSchema),
    defaultValues: {
      orgName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  })

  // 4. Hàm xử lý khi submit form (Kết nối Backend)
  const onSubmit = async (data: SignUpEmployerValues) => {
    setIsLoading(true)
    try {
      // Gọi API backend ở đây
      const response = await fetch("http://localhost:8080/api/v1/auth/signup/employer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orgName: data.orgName,
          phone: data.phone,
          email: data.email,
          password: data.password,
        }),
      })

      if (!response.ok) {
        throw new Error("Đăng ký thất bại")
      }

      const result = await response.json()
      console.log("Đăng ký thành công:", result)
      // Chuyển hướng hoặc thông báo thành công
    } catch (error) {
      console.error("Lỗi:", error)
      // Hiển thị thông báo lỗi cho người dùng
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative flex flex-col items-startp-8 w-full h-full gap-8"
    >
      <FieldGroup className="z-20 w-full">
        <Field>
          <FieldLabel htmlFor="orgName">Organization / business name</FieldLabel>
          <FieldContent>
            <Input
              id="orgName"
              placeholder="Placeholder"
              {...register("orgName")}
            />
            {errors.orgName && (
              <p className="text-red-500 text-sm mt-1">{errors.orgName.message}</p>
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="phone">Phone number</FieldLabel>
          <FieldContent>
            <Input
              id="phone"
              type="tel"
              placeholder="Placeholder"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              placeholder="Placeholder"
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
            className="inline-flex items-center justify-center rounded-[4px] border-2 border-[#e0e0e0] size-4"
            {...register("terms")}
          />
          <div className="flex items-center gap-2">
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

      <div className="flex items-center self-stretch justify-center z-20">
        <Button
          type="submit"
          variant="default"
          className="h-12 rounded-md px-6 w-[608px]"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </form>
  )
}

