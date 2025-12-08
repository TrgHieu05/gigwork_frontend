"use client";

import { useState } from "react";
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
} from "lucide-react";

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

interface NotificationsPageProps {
    notifications?: Notification[];
}

const notificationTypeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
    application: { icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    job: { icon: Briefcase, color: "text-green-600", bg: "bg-green-100" },
    message: { icon: MessageSquare, color: "text-purple-600", bg: "bg-purple-100" },
    system: { icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100" },
};

const defaultNotifications: Notification[] = [
    {
        id: "1",
        type: "application",
        title: "New Application",
        message: "John Smith applied for Warehouse Associate position",
        time: "5 minutes ago",
        isRead: false,
    },
    {
        id: "2",
        type: "application",
        title: "New Application",
        message: "Emily Johnson applied for Retail Sales Associate position",
        time: "1 hour ago",
        isRead: false,
    },
    {
        id: "3",
        type: "job",
        title: "Job Expired",
        message: "Your job posting 'Event Staff' has expired",
        time: "2 hours ago",
        isRead: true,
    },
    {
        id: "4",
        type: "message",
        title: "New Message",
        message: "Michael Brown sent you a message",
        time: "3 hours ago",
        isRead: false,
    },
    {
        id: "5",
        type: "system",
        title: "Profile Updated",
        message: "Your profile has been successfully updated",
        time: "1 day ago",
        isRead: true,
    },
];

export function NotificationsPage({ notifications: initialNotifications = defaultNotifications }: NotificationsPageProps) {
    const { isEmployee } = useRole();
    const [activeTab, setActiveTab] = useState("all");
    const [notifications, setNotifications] = useState(initialNotifications);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filteredNotifications = activeTab === "all"
        ? notifications
        : activeTab === "unread"
            ? notifications.filter(n => !n.isRead)
            : notifications.filter(n => n.type === activeTab);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, isRead: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

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
