"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRole } from "@/contexts/RoleContext";
import {
    Bell,
    Users,
    Briefcase,
    CheckCircle,
    AlertCircle,
    MessageSquare,
    Clock,
    Check,
    Trash2,
    Loader2,
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

type NotificationType = "application" | "job" | "message" | "system";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    link?: string;
}

const notificationTypeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
    application: { icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    job: { icon: Briefcase, color: "text-green-600", bg: "bg-green-100" },
    message: { icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-100" },
    system: { icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100" },
};

// Transform API notification to component format
function transformApiNotification(apiNotification: {
    id: number;
    type?: string;
    title?: string;
    message?: string;
    createdAt?: string;
    isRead?: boolean;
}): Notification {
    // Map API types to our types
    const typeMap: Record<string, NotificationType> = {
        application: "application",
        job: "job",
        message: "message",
        system: "system",
    };

    const type = typeMap[apiNotification.type || ""] || "system";

    // Format time
    let time = "Recently";
    if (apiNotification.createdAt) {
        const date = new Date(apiNotification.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            time = diffMins <= 1 ? "Just now" : `${diffMins} minutes ago`;
        } else if (diffHours < 24) {
            time = diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
        } else {
            time = diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
        }
    }

    return {
        id: String(apiNotification.id),
        type,
        title: apiNotification.title || "Notification",
        message: apiNotification.message || "",
        time,
        isRead: apiNotification.isRead || false,
    };
}

export function NotificationsPage() {
    const { isEmployee } = useRole();
    const [activeTab, setActiveTab] = useState("all");

    // Use SWR hook for cached notifications
    const { notifications: apiNotifications, isLoading } = useNotifications();

    // Local state for tracking local modifications (read/deleted)
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

    // Transform and memoize notifications with local state applied
    const notifications = useMemo(() => {
        // Safety check to prevent map error if apiNotifications is not an array
        if (!Array.isArray(apiNotifications)) {
            console.warn("apiNotifications is not an array:", apiNotifications);
            return [];
        }

        return apiNotifications
            .map(transformApiNotification)
            .filter((n: Notification) => !deletedIds.has(n.id))
            .map((n: Notification) => ({
                ...n,
                isRead: n.isRead || readIds.has(n.id)
            }));
    }, [apiNotifications, readIds, deletedIds]);

    const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

    const filteredNotifications = activeTab === "all"
        ? notifications
        : activeTab === "unread"
            ? notifications.filter((n: Notification) => !n.isRead)
            : notifications.filter((n: Notification) => n.type === activeTab);

    const markAsRead = (id: string) => {
        setReadIds(prev => new Set(prev).add(id));
    };

    const markAllAsRead = () => {
        const allIds = new Set(notifications.map((n: Notification) => n.id));
        setReadIds(allIds);
    };

    const deleteNotification = (id: string) => {
        setDeletedIds(prev => new Set(prev).add(id));
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="h-full p-6 space-y-6 overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <p className="text-muted-foreground">
                        {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "All caught up!"}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button variant="outline" onClick={markAllAsRead}>
                        <Check className="h-4 w-4 mr-2" />
                        Mark all as read
                    </Button>
                )}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">
                        Unread {unreadCount > 0 && `(${unreadCount})`}
                    </TabsTrigger>
                    {!isEmployee && (
                        <TabsTrigger value="application">Applications</TabsTrigger>
                    )}
                    <TabsTrigger value="job">Jobs</TabsTrigger>
                    <TabsTrigger value="message">Messages</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="text-center py-12">
                            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No notifications</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification) => {
                            const TypeIcon = notificationTypeConfig[notification.type].icon;
                            return (
                                <Card
                                    key={notification.id}
                                    className={`transition-colors ${!notification.isRead ? "bg-primary/5 border-primary/20" : ""}`}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-full ${notificationTypeConfig[notification.type].bg}`}>
                                                <TypeIcon className={`h-5 w-5 ${notificationTypeConfig[notification.type].color}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold">{notification.title}</h3>
                                                            {!notification.isRead && (
                                                                <Badge variant="default" className="text-xs">New</Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {notification.message}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        {!notification.isRead && (
                                                            <Button
                                                                variant="outline"
                                                                className="h-8 w-8 p-0 border-0"
                                                                onClick={() => markAsRead(notification.id)}
                                                                title="Mark as read"
                                                            >
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="outline"
                                                            className="h-8 w-8 p-0 border-0 text-muted-foreground"
                                                            onClick={() => deleteNotification(notification.id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{notification.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
