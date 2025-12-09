"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
import { Loader2 } from "lucide-react";
import { jobsService, Job, JobType, CreateJobData } from "@/services/jobs";
import { LocationSelector } from "@/components/shared/LocationSelector";

interface EditJobModalProps {
    jobId: string | null;
    onClose: () => void;
    onJobUpdated: () => void;
}

// Job types matching API enum
const jobTypes: { value: JobType; label: string }[] = [
    { value: "physical_work", label: "Physical Work" },
    { value: "fnb", label: "Food & Beverage" },
    { value: "event", label: "Event" },
    { value: "retail", label: "Retail" },
    { value: "others", label: "Others" },
];

export function EditJobModal({ jobId, onClose, onJobUpdated }: EditJobModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateJobData>({
        title: "",
        description: "",
        location: {
            province: "",
            city: "",
            ward: "",
            address: "",
        },
        startDate: "",
        durationDays: 1,
        workerQuota: 1,
        salary: 0,
        type: "physical_work",
    });

    useEffect(() => {
        if (jobId) {
            fetchJobDetails(jobId);
        }
    }, [jobId]);

    const fetchJobDetails = async (id: string) => {
        setIsLoading(true);
        try {
            const job = await jobsService.getJob(Number(id));
            setFormData({
                title: job.title,
                description: job.description,
                location: job.locationRef || job.locationDetail || {
                    province: "",
                    city: "",
                    ward: "",
                    address: "",
                },
                startDate: job.startDate.split("T")[0],
                durationDays: job.durationDays,
                workerQuota: job.workerQuota,
                salary: job.salary || 0,
                type: job.type,
            });
        } catch (error) {
            console.error("Error fetching job details:", error);
            setError("Failed to load job details");
        } finally {
            setIsLoading(false);
        }
    };

    const updateField = (field: keyof CreateJobData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const updateLocation = (field: keyof CreateJobData["location"], value: string) => {
        setFormData((prev) => ({
            ...prev,
            location: {
                ...prev.location,
                [field]: value,
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!jobId) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await jobsService.updateJob(Number(jobId), {
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
            });
            onJobUpdated();
            onClose();
        } catch (err) {
            console.error("Error updating job:", err);
            setError("Failed to update job. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={!!jobId} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Job</DialogTitle>
                    <DialogDescription>
                        Update the details of your job posting.
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title *</Label>
                                <Input
                                    id="title"
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => updateField("description", e.target.value)}
                                rows={4}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Location *</Label>
                            <LocationSelector
                                value={{
                                    province: formData.location.province,
                                    city: formData.location.city,
                                    ward: formData.location.ward || "",
                                    address: formData.location.address,
                                }}
                                onChange={(val) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        location: {
                                            province: val.province,
                                            city: val.city,
                                            ward: val.ward,
                                            address: val.address
                                        }
                                    }));
                                }}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date *</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => updateField("startDate", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="durationDays">Duration (days) *</Label>
                                <Input
                                    id="durationDays"
                                    type="number"
                                    min={1}
                                    value={formData.durationDays}
                                    onChange={(e) => updateField("durationDays", parseInt(e.target.value) || 1)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary (VND) *</Label>
                                <Input
                                    id="salary"
                                    type="number"
                                    min={0}
                                    value={formData.salary}
                                    onChange={(e) => updateField("salary", parseInt(e.target.value) || 0)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="workerQuota">Workers Needed *</Label>
                                <Input
                                    id="workerQuota"
                                    type="number"
                                    min={1}
                                    value={formData.workerQuota}
                                    onChange={(e) => updateField("workerQuota", parseInt(e.target.value) || 1)}
                                    required
                                />
                            </div>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
