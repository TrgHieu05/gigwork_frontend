"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Briefcase, X } from "lucide-react";

interface ApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    jobTitle: string;
    company: string;
}

export function ApplyModal({ isOpen, onClose, onConfirm, jobTitle, company }: ApplyModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-background rounded-lg shadow-lg p-6 w-full max-w-md mx-4 z-10">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-muted"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold mb-2">Apply for this job?</h2>
                    <p className="text-muted-foreground">
                        You are about to apply for <span className="font-medium text-foreground">{jobTitle}</span> at <span className="font-medium text-foreground">{company}</span>.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full">
                    <Button variant="outline" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="flex-1" onClick={onConfirm}>
                        Confirm Apply
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function useApplyModal() {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return { isOpen, openModal, closeModal };
}
