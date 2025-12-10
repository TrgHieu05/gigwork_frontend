"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ArrowLeft,
    Mail,
    Phone,
    Calendar,
    User,
    Star,
    Loader2,
    Pencil,
    Camera,
    Building,
    MapPin,
} from "lucide-react";
import { authService, getErrorMessage } from "@/services/auth";
import { profileService, UserProfile } from "@/services/profile";
import { EditProfileModal } from "@/components/feature/profile/EditProfileModal";

function getInitials(email: string): string {
    return email.split("@")[0].slice(0, 2).toUpperCase();
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Get image URL for avatar with timestamp to force refresh after update
    const [avatarUrl, setAvatarUrl] = useState<string>('');

    useEffect(() => {
        if (profile) {
            const isEmployee = profile.isWorker;
            const isEmployer = profile.isEmployer;
            const role = isEmployer ? 'employer' : 'employee';
            const kind = isEmployer ? 'company_logo' : 'avatar';
            
            // Initial URL
            const url = profileService.getImageUrl(role, kind);
            setAvatarUrl(url);
        }
    }, [profile]);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            setError(null);

            const currentUser = authService.getCurrentUser();
            const profileId = Number(params.id);

            // Check if viewing own profile
            if (currentUser && currentUser.id === profileId) {
                setIsOwner(true);
                // For own profile, use getCurrentUser to get full data
                try {
                    const userData = await profileService.getCurrentUser();
                    setProfile(userData);
                } catch (err) {
                    console.error("Error fetching own profile:", err);
                    setError(getErrorMessage(err));
                }
            } else {
                // For other users, we need to determine their role first
                // Try to fetch employee profile, if fails try employer
                try {
                    const employeeProfile = await profileService.getEmployeeProfile(profileId);
                    // Build partial UserProfile from employee data
                    setProfile({
                        id: profileId,
                        email: "", // Not available from profile endpoint
                        isVerified: true,
                        isWorker: true,
                        isEmployer: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        isActive: true,
                        ratingAvg: 0,
                        ratingCount: 0,
                        workerProfile: {
                            bio: employeeProfile.bio,
                            skills: employeeProfile.skills as Record<string, boolean> | null,
                            dob: employeeProfile.dob,
                            gender: employeeProfile.gender,
                        },
                    });
                } catch {
                    // If employee profile fails, try employer
                    try {
                        const employerProfile = await profileService.getEmployerProfile(profileId);
                        setProfile({
                            id: profileId,
                            email: "",
                            isVerified: true,
                            isWorker: false,
                            isEmployer: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            isActive: true,
                            ratingAvg: 0,
                            ratingCount: 0,
                            employerProfile: {
                                companyName: employerProfile.companyName,
                                companyAddress: employerProfile.companyAddress,
                            },
                        });
                    } catch {
                        setError("Profile not found");
                    }
                }
            }

            setIsLoading(false);
        };
        fetchProfile();
    }, [params.id]);

    // Remove the old handleAvatarChange function definition since we moved it up
    
    const handleAvatarClick = () => {
        if (isOwner && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleEditProfile = () => {
        setIsEditModalOpen(true);
    };

    const handleProfileSave = (updatedProfile: UserProfile) => {
        setProfile(updatedProfile);
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">{error || "Profile not found"}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                </Button>
            </div>
        );
    }

    const isEmployee = profile.isWorker;
    const isEmployer = profile.isEmployer;

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && profile) {
            setIsUploading(true);
            try {
                const isEmployer = profile.isEmployer;
                const imageKind = isEmployer ? 'company_logo' : 'avatar';
                const role = isEmployer ? 'employer' : 'employee';
                
                await profileService.uploadImage(role, file, imageKind);
                
                // Update avatar URL with timestamp to force reload
                const newUrl = `${profileService.getImageUrl(role, imageKind)}&t=${Date.now()}`;
                setAvatarUrl(newUrl);
                
                // Refresh profile to get new data if needed
                if (isOwner) {
                    const userData = await profileService.getCurrentUser();
                    setProfile(userData);
                }
            } catch (err) {
                console.error("Error uploading image:", err);
                // Don't use alert, use a toast or just log it
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div className="h-full p-6 overflow-auto">
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        className="h-9 w-9 p-0 border-0"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">
                        {isOwner
                            ? (isEmployer ? "My Company Profile" : "My Profile")
                            : (isEmployer ? "Employer Profile" : "Employee Profile")
                        }
                    </h1>
                </div>
                {isOwner && (
                    <Button onClick={handleEditProfile} disabled={isUploading}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Profile
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Info */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Avatar & Basic Info */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative group">
                                    <Avatar
                                        className={`h-24 w-24 mb-4 ${isOwner ? 'cursor-pointer' : ''}`}
                                        onClick={handleAvatarClick}
                                    >
                                        <AvatarImage src={isOwner ? avatarUrl : ''} />
                                        <AvatarFallback className="text-2xl">
                                            {isEmployer ? (
                                                <Building className="h-10 w-10 text-primary" />
                                            ) : (
                                                getInitials(profile.email || "US")
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isOwner && (
                                        <div
                                            className={`absolute bottom-4 right-0 bg-primary text-white p-1.5 rounded-full cursor-pointer hover:bg-primary/90 transition-colors ${isUploading ? 'opacity-50' : ''}`}
                                            onClick={handleAvatarClick}
                                        >
                                            {isUploading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Camera className="h-4 w-4" />
                                            )}
                                        </div>
                                    )}
                                </div>

                                <h2 className="text-xl font-semibold">
                                    {isEmployer
                                        ? (profile.employerProfile?.companyName || "Company Name")
                                        : (profile.email?.split("@")[0] || "User")
                                    }
                                </h2>

                                <div className="flex items-center gap-1 mt-2">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{profile.ratingAvg?.toFixed(1) || "0.0"}</span>
                                    <span className="text-muted-foreground">({profile.ratingCount || 0} reviews)</span>
                                </div>

                                {profile.isVerified && (
                                    <Badge className="mt-3 bg-green-100 text-green-700">
                                        {isEmployer ? "Verified Employer" : "Verified"}
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {profile.email && (
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{profile.email}</span>
                                </div>
                            )}
                            {profile.phone && (
                                <div className="flex items-center gap-3">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{profile.phone}</span>
                                </div>
                            )}
                            {isEmployee && profile.workerProfile?.dob && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                        {calculateAge(profile.workerProfile.dob)} years old
                                    </span>
                                </div>
                            )}
                            {isEmployee && profile.workerProfile?.gender && (
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm capitalize">{profile.workerProfile.gender}</span>
                                </div>
                            )}
                            {isEmployer && profile.employerProfile?.companyAddress && (
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <span className="text-sm">{profile.employerProfile.companyAddress}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {isEmployer ? "Job Statistics" : "Work Statistics"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {isEmployee && (
                                    <>
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <p className="text-2xl font-bold text-green-600">
                                                {profile.applicationCounts?.completed || 0}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Completed</p>
                                        </div>
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <p className="text-2xl font-bold text-blue-600">
                                                {profile.applicationCounts?.accepted || 0}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Accepted</p>
                                        </div>
                                    </>
                                )}
                                {isEmployer && (
                                    <>
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <p className="text-2xl font-bold text-blue-600">
                                                {profile.jobCounts?.total || 0}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Total Jobs</p>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <p className="text-2xl font-bold text-green-600">
                                                {profile.jobCounts?.open || 0}
                                            </p>
                                            <p className="text-xs text-muted-foreground">Open Jobs</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            {profile.createdAt && (
                                <p className="text-xs text-muted-foreground text-center mt-4">
                                    Member since {formatDate(profile.createdAt)}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Bio / About */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {isEmployer ? "About the Company" : "About"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isEmployee && profile.workerProfile?.bio ? (
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {profile.workerProfile.bio}
                                </p>
                            ) : (
                                <p className="text-muted-foreground italic">
                                    {isOwner
                                        ? (isEmployer ? "Add a company description to attract workers" : "Add a bio to tell employers about yourself")
                                        : "No description available"
                                    }
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Skills (Employee only) */}
                    {isEmployee && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Skills</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {(() => {
                                    // Handle skills as { list: string[] } structure from API
                                    const skillsData = profile.workerProfile?.skills as { list?: string[] } | null;
                                    const skillsList = skillsData?.list || [];

                                    if (skillsList.length > 0) {
                                        return (
                                            <div className="flex flex-wrap gap-2">
                                                {skillsList.map((skill) => (
                                                    <Badge key={skill} variant="secondary" className="capitalize">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        );
                                    }

                                    return (
                                        <p className="text-muted-foreground italic">
                                            {isOwner ? "Add skills to help employers find you" : "No skills listed"}
                                        </p>
                                    );
                                })()}
                            </CardContent>
                        </Card>
                    )}

                    {/* Open Jobs (Employer only) */}
                    {isEmployer && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Open Positions</CardTitle>
                                <Badge variant="secondary">{profile.jobCounts?.open || 0} jobs</Badge>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-center py-8">
                                    Open job listings will be displayed here
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Reviews */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {isEmployer ? "Reviews from Workers" : "Reviews"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-center py-8">
                                Reviews will be displayed here
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {profile && (
                <EditProfileModal
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    profile={profile}
                    onSave={handleProfileSave}
                />
            )}
        </div>
    );
}
