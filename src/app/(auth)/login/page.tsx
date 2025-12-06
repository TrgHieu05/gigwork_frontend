import LoginForm from "@/components/feature/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start gap-8">
        <div className="flex items-center justify-between w-full h-fit">
            <div className="inline-flex flex-col items-start justify-center">
                <p className="text-2xl font-bold text-[#21212c]">Sign in to</p>
                <p className="text-2xl font-bold text-[#0077ff]">Gigwork</p>
            </div>
            <div className="inline-flex flex-col items-end justify-center">
                <p className="text-md font-medium text-black">Doesn't have an account ?</p>
                <a href="/signup" className="text-base text-primary underline">
                Sign up here
                </a>
            </div>
        </div>
        <LoginForm />
     </div>
  )
}