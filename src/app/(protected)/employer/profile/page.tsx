"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { Loader2 } from "lucide-react";

export default function EmployerProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser?.id) {
      router.replace(`/users/${currentUser.id}`);
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}