"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2 } from "lucide-react";
import { jobsService, JobType } from "@/services/jobs";

export default function CreateJobPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        province: "",
        city: "",
        ward: "",
        address: "",
        salary: "",
        workerQuota: 1,
        startDate: "",
        durationDays: 1,
        type: "physical_work" as JobType,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "workerQuota" || name === "durationDays" ? parseInt(value) || 1 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
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
                startDate: formData.startDate,
                durationDays: formData.durationDays,
                workerQuota: formData.workerQuota,
                salary: parseFloat(formData.salary) || undefined,
                type: formData.type,
            });
            router.push("/employer/my-jobs");
        } catch (error) {
            console.error("Error creating job:", error);
            alert("Failed to create job. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-full p-6 space-y-6 overflow-auto">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">Create New Job</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Job Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title *</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Event Staff for Wedding"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the job responsibilities and requirements..."
                                rows={5}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address *</Label>
                            <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="e.g. 123 Nguyen Hue"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ward">Ward</Label>
                                <Input
                                    id="ward"
                                    name="ward"
                                    value={formData.ward}
                                    onChange={handleChange}
                                    placeholder="e.g. Ben Nghe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="e.g. District 1"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="province">Province *</Label>
                                <Input
                                    id="province"
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    placeholder="e.g. Ho Chi Minh"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="salary">Salary (VND)</Label>
                            <Input
                                id="salary"
                                name="salary"
                                type="number"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="e.g. 500000"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date *</Label>
                                <Input
                                    id="startDate"
                                    name="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="durationDays">Duration (days) *</Label>
                                <Input
                                    id="durationDays"
                                    name="durationDays"
                                    type="number"
                                    min={1}
                                    value={formData.durationDays}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="workerQuota">Number of Workers Needed *</Label>
                                <Input
                                    id="workerQuota"
                                    name="workerQuota"
                                    type="number"
                                    min={1}
                                    value={formData.workerQuota}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Job Type *</Label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                    required
                                >
                                    <option value="physical_work">Physical Work</option>
                                    <option value="fnb">F&B</option>
                                    <option value="event">Event</option>
                                    <option value="retail">Retail</option>
                                    <option value="others">Others</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Create Job
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
