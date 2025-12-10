"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { profileService, UserProfile } from "@/services/profile";

interface EditProfileModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profile: UserProfile;
    onSave: (updatedProfile: UserProfile) => void;
}

export function EditProfileModal({
    open,
    onOpenChange,
    profile,
    onSave,
}: EditProfileModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Employee fields
    const [bio, setBio] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState("");

    // Employer fields
    const [companyName, setCompanyName] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");

    // Common fields
    const [phone, setPhone] = useState("");

    const isEmployee = profile.isWorker;
    const isEmployer = profile.isEmployer;

    // Initialize form with profile data
    useEffect(() => {
        if (open && profile) {
            setPhone(profile.phone || "");

            if (isEmployee && profile.workerProfile) {
                setBio(profile.workerProfile.bio || "");
                setGender(profile.workerProfile.gender || "");
                setDob(profile.workerProfile.dob?.split("T")[0] || "");
                // Convert skills object to array
                const skillsArray = profile.workerProfile.skills
                    ? Object.entries(profile.workerProfile.skills)
                        .filter(([, v]) => v)
                        .map(([k]) => k)
                    : [];
                setSkills(skillsArray);
            }

            if (isEmployer && profile.employerProfile) {
                setCompanyName(profile.employerProfile.companyName || "");
                setCompanyAddress(profile.employerProfile.companyAddress || "");
            }
        }
    }, [open, profile, isEmployee, isEmployer]);

    const handleAddSkill = () => {
        if (newSkill.trim() && !skills.includes(newSkill.trim().toLowerCase())) {
            setSkills([...skills, newSkill.trim().toLowerCase()]);
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkills(skills.filter((s) => s !== skillToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (isEmployee) {
                // Convert skills array to object
                const skillsObject: Record<string, boolean> = {};
                skills.forEach((skill) => {
                    skillsObject[skill] = true;
                });

                await profileService.updateEmployeeProfile({
                    bio: bio || undefined,
                    gender: gender || undefined,
                    dob: dob ? new Date(dob).toISOString() : undefined,
                    skills: skillsObject,
                });
            }

            if (isEmployer) {
                if (profile.employerProfile) {
                    await profileService.updateEmployerProfile({
                        companyName: companyName || undefined,
                        companyAddress: companyAddress || undefined,
                    });
                } else {
                    // If no existing employer profile, create new one
                    await profileService.createEmployerProfile({
                        companyName: companyName,
                        companyAddress: companyAddress || undefined,
                    });
                }
            }

            // Fetch updated profile
            const updatedProfile = await profileService.getCurrentUser();
            onSave(updatedProfile);
            onOpenChange(false);
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEmployer ? "Edit Company Profile" : "Edit Profile"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Common: Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter phone number"
                        />
                    </div>

                    {/* Employee Fields */}
                    {isEmployee && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell employers about yourself..."
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select value={gender} onValueChange={setGender}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input
                                        id="dob"
                                        type="date"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Skills</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Add a skill"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddSkill();
                                            }
                                        }}
                                    />
                                    <Button type="button" variant="outline" onClick={handleAddSkill}>
                                        Add
                                    </Button>
                                </div>
                                {skills.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveSkill(skill)}
                                                    className="hover:text-destructive"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Employer Fields */}
                    {isEmployer && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="companyName">Company Name *</Label>
                                <Input
                                    id="companyName"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Enter company name"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="companyAddress">Company Address</Label>
                                <Textarea
                                    id="companyAddress"
                                    value={companyAddress}
                                    onChange={(e) => setCompanyAddress(e.target.value)}
                                    placeholder="Enter company address"
                                    rows={2}
                                />
                            </div>
                        </>
                    )}

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
