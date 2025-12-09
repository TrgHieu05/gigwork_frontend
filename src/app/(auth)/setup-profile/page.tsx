"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Field,
    FieldContent,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { User, Building, ArrowRight, Loader2 } from "lucide-react";
import { authService } from "@/services/auth";
import { profileService } from "@/services/profile";
import { getErrorMessage } from "@/services/auth";

// Employee profile schema
const employeeProfileSchema = z.object({
    bio: z.string().optional(),
    gender: z.string().optional(),
    dob: z.string().optional(),
});

// Employer profile schema
const employerProfileSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    companyAddress: z.string().optional(),
});

type EmployeeProfileValues = z.infer<typeof employeeProfileSchema>;
type EmployerProfileValues = z.infer<typeof employerProfileSchema>;

export default function SetupProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<"employee" | "employer" | null>(null);

    // Get user role from stored user data
    useEffect(() => {
        const user = authService.getCurrentUser();
        if (!user) {
            router.push("/login");
            return;
        }

        if (user.isWorker) {
            setUserRole("employee");
        } else if (user.isEmployer) {
            setUserRole("employer");
        }
    }, [router]);

    // Employee form
    const employeeForm = useForm<EmployeeProfileValues>({
        resolver: zodResolver(employeeProfileSchema),
        defaultValues: {
            bio: "",
            gender: "",
            dob: "",
        },
    });

    // Employer form
    const employerForm = useForm<EmployerProfileValues>({
        resolver: zodResolver(employerProfileSchema),
        defaultValues: {
            companyName: "",
            companyAddress: "",
        },
    });

    const onSubmitEmployee = async (data: EmployeeProfileValues) => {
        setIsLoading(true);
        setError(null);

        try {
            await profileService.createEmployeeProfile({
                bio: data.bio || undefined,
                gender: data.gender || undefined,
                dob: data.dob ? new Date(data.dob).toISOString() : undefined,
            });
            router.push("/employee/dashboard");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitEmployer = async (data: EmployerProfileValues) => {
        setIsLoading(true);
        setError(null);

        try {
            await profileService.createEmployerProfile({
                companyName: data.companyName,
                companyAddress: data.companyAddress || undefined,
            });
            router.push("/employer/dashboard");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        if (userRole === "employee") {
            router.push("/employee/dashboard");
        } else {
            router.push("/employer/dashboard");
        }
    };

    if (!userRole) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-lg mx-auto">
            <Card>
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        {userRole === "employee" ? (
                            <div className="p-4 bg-primary/10 rounded-full">
                                <User className="h-8 w-8 text-primary" />
                            </div>
                        ) : (
                            <div className="p-4 bg-primary/10 rounded-full">
                                <Building className="h-8 w-8 text-primary" />
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {userRole === "employee" ? "Complete Your Profile" : "Set Up Your Company"}
                    </CardTitle>
                    <CardDescription>
                        {userRole === "employee"
                            ? "Tell us a bit about yourself to help employers find you"
                            : "Add your company details to start posting jobs"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {/* Error message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {userRole === "employee" ? (
                        /* Employee Profile Form */
                        <form onSubmit={employeeForm.handleSubmit(onSubmitEmployee)} className="space-y-6">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="bio">Bio</FieldLabel>
                                    <FieldContent>
                                        <textarea
                                            id="bio"
                                            placeholder="Tell us about yourself..."
                                            className="w-full h-24 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                            {...employeeForm.register("bio")}
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="gender">Gender</FieldLabel>
                                    <FieldContent>
                                        <select
                                            id="gender"
                                            className="w-full h-10 px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                            {...employeeForm.register("gender")}
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer_not_to_say">Prefer not to say</option>
                                        </select>
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="dob">Date of Birth</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            id="dob"
                                            type="date"
                                            {...employeeForm.register("dob")}
                                        />
                                    </FieldContent>
                                </Field>
                            </FieldGroup>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleSkip}
                                >
                                    Skip for now
                                </Button>
                                <Button type="submit" className="flex-1" disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <ArrowRight className="h-4 w-4 mr-2" />
                                    )}
                                    Continue
                                </Button>
                            </div>
                        </form>
                    ) : (
                        /* Employer Profile Form */
                        <form onSubmit={employerForm.handleSubmit(onSubmitEmployer)} className="space-y-6">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="companyName">Company Name *</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            id="companyName"
                                            placeholder="Enter your company name"
                                            {...employerForm.register("companyName")}
                                        />
                                        {employerForm.formState.errors.companyName && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {employerForm.formState.errors.companyName.message}
                                            </p>
                                        )}
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="companyAddress">Company Address</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            id="companyAddress"
                                            placeholder="Enter company address"
                                            {...employerForm.register("companyAddress")}
                                        />
                                    </FieldContent>
                                </Field>
                            </FieldGroup>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleSkip}
                                >
                                    Skip for now
                                </Button>
                                <Button type="submit" className="flex-1" disabled={isLoading}>
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <ArrowRight className="h-4 w-4 mr-2" />
                                    )}
                                    Continue
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
