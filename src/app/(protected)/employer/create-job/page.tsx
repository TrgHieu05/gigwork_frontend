"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    ArrowLeft,
    Briefcase,
    MapPin,
    FileText,
    Loader2,
    Users,
    Calendar,
    AlertCircle,
} from "lucide-react";
import { jobsService, JobType } from "@/services/jobs";
import { LocationSelector } from "@/components/shared/LocationSelector";

// Job types matching API enum
const jobTypes: { value: JobType; label: string }[] = [
    { value: "physical_work", label: "Physical Work" },
    { value: "fnb", label: "Food & Beverage" },
    { value: "event", label: "Event" },
    { value: "retail", label: "Retail" },
    { value: "others", label: "Others" },
];

interface JobFormData {
    title: string;
    description: string;
    province: string;
    city: string;
    ward: string;
    address: string;
    startDate: string;
    durationDays: number;
    workerQuota: number;
    salary: number;
    type: JobType;
}

export default function CreateJobPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showProfileRequiredModal, setShowProfileRequiredModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState<JobFormData>({
        title: "",
        description: "",
        province: "",
        city: "",
        ward: "",
        address: "",
        startDate: "",
        durationDays: 1,
        workerQuota: 1,
        salary: 0,
        type: "physical_work",
    });

    const updateField = <K extends keyof JobFormData>(field: K, value: JobFormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        // Validation
        if (!formData.title.trim()) {
            setError("Job title is required");
            setIsSubmitting(false);
            return;
        }
        if (!formData.description.trim()) {
            setError("Job description is required");
            setIsSubmitting(false);
            return;
        }
        if (!formData.address.trim()) {
            setError("Address is required");
            setIsSubmitting(false);
            return;
        }
        if (!formData.city.trim()) {
            setError("City is required");
            setIsSubmitting(false);
            return;
        }
        if (!formData.province.trim()) {
            setError("Province is required");
            setIsSubmitting(false);
            return;
        }
        if (!formData.startDate) {
            setError("Start date is required");
            setIsSubmitting(false);
            return;
        }

        try {
            await jobsService.createJob({
                title: formData.title,
                description: formData.description,
                location: {
                    province: formData.province,
                    city: formData.city,
                    ward: formData.ward || undefined,
                    address: formData.address,
                },
                startDate: new Date(formData.startDate).toISOString(),
                durationDays: formData.durationDays,
                workerQuota: formData.workerQuota,
                salary: formData.salary,
                type: formData.type,
            });

            setShowSuccessModal(true);
        } catch (err: any) {
            console.error("Error creating job:", err);

            // Check for specific 403 error from backend
            if (err.response?.status === 403 && err.response?.data?.detail === "Employer profile required") {
                setShowProfileRequiredModal(true);
                return;
            }

            setError("Failed to create job. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-full p-6 space-y-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="outline" className="h-9 w-9 p-0 border-0" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Post a New Job</h1>
                    <p className="text-muted-foreground">Fill in the details to create a job posting</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title *</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Warehouse Associate, Event Staff"
                                value={formData.title}
                                onChange={(e) => updateField("title", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Job Type *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => updateField("type", value as JobType)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jobTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the job responsibilities, requirements, and any other relevant details..."
                                value={formData.description}
                                onChange={(e) => updateField("description", e.target.value)}
                                rows={5}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Location */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Location
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LocationSelector
                            value={{
                                province: formData.province,
                                city: formData.city,
                                ward: formData.ward,
                                address: formData.address,
                            }}
                            onChange={(val) => {
                                setFormData(prev => ({
                                    ...prev,
                                    province: val.province,
                                    city: val.city,
                                    ward: val.ward,
                                    address: val.address
                                }));
                            }}
                            required
                        />
                    </CardContent>
                </Card>

                {/* Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" />
                            Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date *</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => updateField("startDate", e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="durationDays">Duration (days) *</Label>
                                <Input
                                    id="durationDays"
                                    type="number"
                                    min={1}
                                    max={365}
                                    value={formData.durationDays}
                                    onChange={(e) => updateField("durationDays", parseInt(e.target.value) || 1)}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Salary */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            💰 Salary
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="salary">Salary (VND) *</Label>
                            <Input
                                id="salary"
                                type="number"
                                min={0}
                                placeholder="e.g., 500000"
                                value={formData.salary || ""}
                                onChange={(e) => updateField("salary", parseInt(e.target.value) || 0)}
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                Total salary for the job
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Workers */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Workers Needed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="workerQuota">Number of Workers *</Label>
                            <Input
                                id="workerQuota"
                                type="number"
                                min={1}
                                max={100}
                                value={formData.workerQuota}
                                onChange={(e) => updateField("workerQuota", parseInt(e.target.value) || 1)}
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                How many workers do you need for this job?
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <FileText className="h-4 w-4 mr-2" />
                                Post Job
                            </>
                        )}
                    </Button>
                </div>
            </form>

            <Dialog open={showProfileRequiredModal} onOpenChange={setShowProfileRequiredModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            Profile Update Required
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            To post jobs, you need to complete your employer profile first. Please update your company information.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowProfileRequiredModal(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => router.push('/employer/profile')}>
                            Go to Profile
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Success Modal */}
            <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Job Posted Successfully!</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your job has been created and is now visible to potential workers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => router.push("/employer/my-jobs")}>
                            Go to My Jobs
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
