"use client";

import { createContext, useContext, ReactNode } from "react";

export type UserRole = "employer" | "jobseeker" | "admin";

interface RoleContextValue {
    role: UserRole;
    basePath: string;
    isEmployer: boolean;
    isJobseeker: boolean;
    isAdmin: boolean;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function useRole() {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("useRole must be used within a RoleProvider");
    }
    return context;
}

interface RoleProviderProps {
    role: UserRole;
    children: ReactNode;
}

export function RoleProvider({ role, children }: RoleProviderProps) {
    const value: RoleContextValue = {
        role,
        basePath: `/${role}`,
        isEmployer: role === "employer",
        isJobseeker: role === "jobseeker",
        isAdmin: role === "admin",
    };

    return (
        <RoleContext.Provider value={value}>
            {children}
        </RoleContext.Provider>
    );
}
