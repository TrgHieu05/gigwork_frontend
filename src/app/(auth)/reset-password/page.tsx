import { ResetPasswordForm } from "@/components/feature/auth/ResetPasswordFrom"

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col items-start w-full h-fit gap-8">
      <span className="w-full font-bold text-2xl">Reset password</span>      
      <ResetPasswordForm />
    </div>
  )
}