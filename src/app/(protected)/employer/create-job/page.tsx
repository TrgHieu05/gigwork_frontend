"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft,
    Briefcase,
    Clock,
    MapPin,
    FileText,
    Plus,
    X,
} from "lucide-react";

interface JobFormData {
    // Basic Information
    title: string;
    category: string;
    positions: number;

    // Duration & Schedule
    startDate: string;
    endDate: string;
    duration: string;
    workSchedule: string;

    // Location & Compensation
    location: string;
    address: string;
    salary: string;
    salaryType: string;

    // Description & Requirements
    description: string;
    requirements: string[];
    benefits: string[];
}

export default function CreateJobPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<JobFormData>({
        title: "",
        category: "",
        positions: 1,
        startDate: "",
        endDate: "",
        duration: "",
        workSchedule: "",
        location: "",
        address: "",
        salary: "",
        salaryType: "hourly",
        description: "",
        requirements: [""],
        benefits: [""],
    });

    const updateField = (field: keyof JobFormData, value: string | number | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addRequirement = () => {
        setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ""] }));
    };

    const removeRequirement = (index: number) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.filter((_, i) => i !== index)
        }));
    };

    const updateRequirement = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            requirements: prev.requirements.map((req, i) => i === index ? value : req)
        }));
    };

    const addBenefit = () => {
        setFormData(prev => ({ ...prev, benefits: [...prev.benefits, ""] }));
    };

    const removeBenefit = (index: number) => {
        setFormData(prev => ({
            ...prev,
            benefits: prev.benefits.filter((_, i) => i !== index)
        }));
    };

    const updateBenefit = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            benefits: prev.benefits.map((ben, i) => i === index ? value : ben)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        // In real app, this would call an API
        router.push("/employer/my-jobs");
    };

    return (
        <div className="h-full p-6 space-y-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Post a New Job</h1>
                    <p className="text-muted-foreground">Fill in the details to create a job posting</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-primary" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Warehouse Associate"
                                    value={formData.title}
                                    onChange={(e) => updateField("title", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Input
                                    id="category"
                                    placeholder="e.g. Warehouse, Retail, Events"
                                    value={formData.category}
                                    onChange={(e) => updateField("category", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="positions">Number of Positions *</Label>
                            <Input
                                id="positions"
                                type="number"
                                min={1}
                                value={formData.positions}
                                onChange={(e) => updateField("positions", parseInt(e.target.value) || 1)}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Duration & Schedule */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Duration & Schedule
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                <Label htmlFor="endDate">End Date *</Label>
                                <Input
                                    id="endDate"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => updateField("endDate", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                    id="duration"
                                    placeholder="e.g. 5 days, 1 week"
                                    value={formData.duration}
                                    onChange={(e) => updateField("duration", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="workSchedule">Work Schedule *</Label>
                            <Input
                                id="workSchedule"
                                placeholder="e.g. Monday - Friday, 8:00 AM - 5:00 PM"
                                value={formData.workSchedule}
                                onChange={(e) => updateField("workSchedule", e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Location & Compensation */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Location & Compensation
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">City/Area *</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g. Chicago, IL"
                                    value={formData.location}
                                    onChange={(e) => updateField("location", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Full Address</Label>
                                <Input
                                    id="address"
                                    placeholder="e.g. 123 Main St, Chicago, IL 60601"
                                    value={formData.address}
                                    onChange={(e) => updateField("address", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary/Rate *</Label>
                                <Input
                                    id="salary"
                                    placeholder="e.g. $18"
                                    value={formData.salary}
                                    onChange={(e) => updateField("salary", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="salaryType">Salary Type *</Label>
                                <select
                                    id="salaryType"
                                    value={formData.salaryType}
                                    onChange={(e) => updateField("salaryType", e.target.value)}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-1 text-sm"
                                    required
                                >
                                    <option value="hourly">Per Hour</option>
                                    <option value="daily">Per Day</option>
                                    <option value="weekly">Per Week</option>
                                    <option value="fixed">Fixed Amount</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Description & Requirements */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Description & Requirements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description *</Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the job responsibilities, expectations, and any other relevant details..."
                                value={formData.description}
                                onChange={(e) => updateField("description", e.target.value)}
                                required
                            />
                        </div>

                        {/* Requirements */}
                        <div className="space-y-3">
                            <Label>Requirements</Label>
                            {formData.requirements.map((req, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        placeholder={`Requirement ${index + 1}`}
                                        value={req}
                                        onChange={(e) => updateRequirement(index, e.target.value)}
                                    />
                                    {formData.requirements.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeRequirement(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="small"
                                onClick={addRequirement}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Requirement
                            </Button>
                        </div>

                        {/* Benefits */}
                        <div className="space-y-3">
                            <Label>Benefits</Label>
                            {formData.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        placeholder={`Benefit ${index + 1}`}
                                        value={benefit}
                                        onChange={(e) => updateBenefit(index, e.target.value)}
                                    />
                                    {formData.benefits.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeBenefit(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="small"
                                onClick={addBenefit}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Benefit
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        Post Job
                    </Button>
                </div>
            </form>
        </div>
    );
}
