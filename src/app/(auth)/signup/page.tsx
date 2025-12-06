'use client'

import { RoleSelector } from "@/components/feature/auth/RoleSelector"
import { SignUpFormEmployee } from "@/components/feature/auth/SignUpFormEmployee"
import { SignUpFormEmployer } from "@/components/feature/auth/SignUpFormEmployer"
import { useState } from "react"
import { User, Briefcase } from "lucide-react"

export default function SignupPage() {
    const [selectedRole, setSelectedRole] = useState<"recruiter" | "jobseeker">(
      "jobseeker"
    )

    const setSelectedRoleHandler = (role: "recruiter" | "jobseeker") => {
      setSelectedRole(role)
    }
  return (
    <div className="w-full h-full flex flex-col items-center justify-start gap-8">
        <div className="flex items-center justify-between w-full h-fit">
            <div className="inline-flex flex-col items-start justify-center">
              <p className="text-2xl font-bold text-[#21212c]">Sign up to</p>
              <p className="text-2xl font-bold text-[#0077ff]">Gigwork</p>
            </div>
            <div className="inline-flex flex-col items-end justify-center">
              <p className="text-md font-medium text-black">Have an account ?</p>
              <a href="/login" className="text-base text-primary underline">
                Sign in here
              </a>
            </div>
        </div>
        <div className="flex flex-row gap-4 items-center justify-center w-full">
            <RoleSelector 
                onSelect={() => setSelectedRoleHandler("jobseeker")}
                active={selectedRole === "jobseeker"} 
                icon={<Briefcase />} 
                role="jobseeker" 
                description="Find a job that's suitable for you and apply !" 
            />
            <RoleSelector 
                onSelect={() => setSelectedRoleHandler("recruiter")}
                active={selectedRole === "recruiter"} 
                icon={<User />} 
                role="recruiter" 
                description="Upload your job and find suitable workers !" 
            />
        </div>
        {selectedRole === "jobseeker" ? <SignUpFormEmployee /> : <SignUpFormEmployer />}
    </div>
  )
}
