"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Star } from "lucide-react";

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (comment: string, rating?: number) => void;
    recipientName: string;
    showRating?: boolean;
    title?: string;
}

export function CommentModal({
    isOpen,
    onClose,
    onSubmit,
    recipientName,
    showRating = false,
    title = "Leave a Comment",
}: CommentModalProps) {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (comment.trim()) {
            onSubmit(comment, showRating ? rating : undefined);
            setComment("");
            setRating(0);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-background rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-muted rounded"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Recipient info */}
                <p className="text-sm text-muted-foreground mb-4">
                    Sending comment to <span className="font-medium text-foreground">{recipientName}</span>
                </p>

                {/* Rating (optional) */}
                {showRating && (
                    <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Rating</p>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                    className="p-1"
                                >
                                    <Star
                                        className={`h-6 w-6 ${star <= (hoveredRating || rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comment textarea */}
                <div className="mb-4">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your comment here..."
                        className="w-full h-32 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={!comment.trim()}>
                        Send Comment
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Hook for managing comment modal state
export function useCommentModal() {
    const [isOpen, setIsOpen] = useState(false);
    return {
        isOpen,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
    };
}
