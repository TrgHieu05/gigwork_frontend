

"use client";

import { Button } from "@/components/ui/button";
import { RoleSelector, roleSelectorVariants } from "@/components/feature/auth/RoleSelector";
import { User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SignUpFormEmployer } from "@/components/feature/auth/SignUpFormEmployer";
import { SignUpFormEmployee } from "@/components/feature/auth/SignUpFormEmployee";


export default function TestComponent() {
  return (
    <div>
      <Button variant="destructive" size="default">
        Destructive Button
      </Button>
      <Button variant="default" size="default">
        Default Button
      </Button>
      <Button variant="outline" size="default">
        Outline Button
      </Button>
      <Button variant="destructive" size="small">
        Destructive Button
      </Button>

      <RoleSelector
        active={true}
        icon={<User />}
        role="jobseeker"
        description="Select as a client"
        onSelect={() => console.log("Client selected")}
      />

      <RoleSelector
        active={false}
        icon={<User />}
        role="recruiter"
        description="Select as a provider"
        onSelect={() => console.log("Provider selected")}
      />

      <Label>
        <span>Email</span>
        <Input type="email" placeholder="Enter your email" />
      </Label>

      <SignUpFormEmployer />
      <SignUpFormEmployee />
    </div>
  )
}