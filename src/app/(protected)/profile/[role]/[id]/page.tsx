"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    Loader2,
    Mail,
    Phone,
    MapPin,
    Building2,
    User,
    Calendar,
    Star,
    Briefcase,
    Award,
} from "lucide-react";
import { profileService } from "@/services/profile";

interface EmployeeProfileData {
    id: number;
    userId: number;
    bio?: string | null;
    skills?: Record<string, boolean> | null;
    dob?: string | null;
    gender?: string | null;
}

interface EmployerProfileData {
    id: number;
    userId: number;
    companyName?: string;
    companyAddress?: string | null;
}

// Skill labels mapping
const skillLabels: Record<string, string> = {
    physical_work: "Physical Work",
    fnb: "Food & Beverage",
    event: "Event Staff",
    retail: "Retail",
    delivery: "Delivery",
    warehouse: "Warehouse",
    cleaning: "Cleaning",
    customer_service: "Customer Service",
    admin: "Administrative",
    others: "Others",
};

function getInitials(name: string): string {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function ProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [employeeProfile, setEmployeeProfile] = useState<EmployeeProfileData | null>(null);
    const [employerProfile, setEmployerProfile] = useState<EmployerProfileData | null>(null);

    const role = params.role as string;
    const userId = Number(params.id);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!role || !userId || isNaN(userId)) {
                setError("Invalid profile URL");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                if (role === "employee") {
                    const profile = await profileService.getEmployeeProfile(userId);
                    setEmployeeProfile(profile as EmployeeProfileData);
                } else if (role === "employer") {
                    const profile = await profileService.getEmployerProfile(userId);
                    setEmployerProfile(profile as EmployerProfileData);
                } else {
                    setError("Invalid role. Must be 'employee' or 'employer'.");
                }
            } catch (err: any) {
                console.error("Error fetching profile:", err);
                if (err?.response?.status === 404) {
                    setError("Profile not found");
                } else {
                    setError("Failed to load profile");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [role, userId]);

    // Get avatar URL
    const avatarUrl = role === "employee"
        ? profileService.getImageUrl("employee", "avatar") + `&userId=${userId}`
        : profileService.getImageUrl("employer", "company_logo") + `&userId=${userId}`;

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <p className="text-destructive">{error}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="h-full p-6 overflow-auto">
            {/* Back Button */}
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            {role === "employee" && employeeProfile && (
                <EmployeeProfileView profile={employeeProfile} avatarUrl={avatarUrl} userId={userId} />
            )}

            {role === "employer" && employerProfile && (
                <EmployerProfileView profile={employerProfile} avatarUrl={avatarUrl} userId={userId} />
            )}
        </div>
    );
}

// Employee Profile View Component
function EmployeeProfileView({
    profile,
    avatarUrl,
    userId
}: {
    profile: EmployeeProfileData;
    avatarUrl: string;
    userId: number;
}) {
    // Parse skills
    const activeSkills = profile.skills
        ? Object.entries(profile.skills)
            .filter(([, value]) => value === true)
            .map(([key]) => skillLabels[key] || key)
        : [];

    // Format date of birth
    const formattedDob = profile.dob
        ? new Date(profile.dob).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : null;

    // Format gender
    const genderDisplay = profile.gender
        ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)
        : null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                        {/* Avatar */}
                        <Avatar className="h-24 w-24 border-4 border-primary/20">
                            <AvatarImage src={avatarUrl} alt="Profile" />
                            <AvatarFallback className="text-2xl bg-primary/10">
                                <User className="h-10 w-10 text-primary" />
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                    <Briefcase className="h-3 w-3 mr-1" />
                                    Employee
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    ID: {userId}
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold mb-1">
                                Worker Profile
                            </h1>

                            {/* Quick Stats */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                                {genderDisplay && (
                                    <div className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        <span>{genderDisplay}</span>
                                    </div>
                                )}
                                {formattedDob && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formattedDob}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Bio Section */}
            {profile.bio && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            About
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                            {profile.bio}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Skills Section */}
            {activeSkills.length > 0 && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            Skills
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {activeSkills.map((skill) => (
                                <Badge key={skill} variant="outline" className="px-3 py-1">
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {!profile.bio && activeSkills.length === 0 && !formattedDob && !genderDisplay && (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        This worker hasn&apos;t added profile details yet.
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// Employer Profile View Component
function EmployerProfileView({
    profile,
    avatarUrl,
    userId
}: {
    profile: EmployerProfileData;
    avatarUrl: string;
    userId: number;
}) {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                        {/* Company Logo */}
                        <Avatar className="h-24 w-24 border-4 border-primary/20">
                            <AvatarImage src={avatarUrl} alt="Company" />
                            <AvatarFallback className="text-2xl bg-primary/10">
                                {profile.companyName ? getInitials(profile.companyName) : (
                                    <Building2 className="h-10 w-10 text-primary" />
                                )}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="default" className="text-xs">
                                    <Building2 className="h-3 w-3 mr-1" />
                                    Employer
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    ID: {userId}
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold mb-1">
                                {profile.companyName || "Company"}
                            </h1>

                            {/* Address */}
                            {profile.companyAddress && (
                                <div className="flex items-center gap-2 text-muted-foreground mt-3">
                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                    <span>{profile.companyAddress}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Company Details */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        Company Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Company Name</p>
                            <p className="font-medium">{profile.companyName || "Not provided"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Company Address</p>
                            <p className="font-medium">{profile.companyAddress || "Not provided"}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Empty State for minimal profile */}
            {!profile.companyName && !profile.companyAddress && (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        This employer hasn&apos;t added company details yet.
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
