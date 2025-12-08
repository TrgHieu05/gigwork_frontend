"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, X } from "lucide-react";

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
                <Card className="w-[400px] shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            {/* Icon */}
                            <div className="p-3 bg-destructive/10 rounded-full">
                                <LogOut className="h-8 w-8 text-destructive" />
                            </div>

                            {/* Title & Description */}
                            <div className="space-y-2">
                                <h2 className="text-xl font-semibold">
                                    Log Out
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Are you sure you want to log out? You will need to sign in again to access your account.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center gap-3 w-full pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={onConfirm}
                                >
                                    Log Out
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

// Hook for easy usage
export function useLogoutModal() {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return {
        isOpen,
        openModal,
        closeModal,
    };
}
