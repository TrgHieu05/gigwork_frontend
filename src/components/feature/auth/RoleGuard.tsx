"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { Loader2 } from "lucide-react";

interface RoleGuardProps {
    children: React.ReactNode;
    requiredRole: "employee" | "employer";
}

export function RoleGuard({ children, requiredRole }: RoleGuardProps) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const user = authService.getCurrentUser();

            if (!user) {
                // Not logged in, redirect to login
                router.replace("/login");
                return;
            }

            if (requiredRole === "employee") {
                if (user.isWorker) {
                    setIsAuthorized(true);
                } else if (user.isEmployer) {
                    // Is employer but trying to access employee route
                    router.replace("/employer/dashboard");
                } else {
                    // No role? Redirect to setup or login
                    router.replace("/login");
                }
            } else if (requiredRole === "employer") {
                if (user.isEmployer) {
                    setIsAuthorized(true);
                } else if (user.isWorker) {
                    // Is worker but trying to access employer route
                    router.replace("/employee/dashboard");
                } else {
                    router.replace("/login");
                }
            }
            
            setIsLoading(false);
        };

        checkAuth();
    }, [router, requiredRole]);

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
