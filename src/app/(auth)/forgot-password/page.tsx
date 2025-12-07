import { ForgotPasswordForm } from "@/components/feature/auth/ForgotPasswordFrom"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col items-start w-full h-fit gap-8">
        <div className="flex flex-row justify-center items-center h-fit w-full gap-2">
            <Link href="/login" className="flex items-center justify-center">
                <ArrowLeft className="w-6 h-6" />
            </Link>
            <span className="w-full font-bold text-2xl">Forgot password</span>
        </div>        
      <ForgotPasswordForm />
    </div>
  )
}