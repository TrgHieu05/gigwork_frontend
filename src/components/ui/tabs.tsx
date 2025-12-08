"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error("Tabs components must be used within a Tabs provider");
    }
    return context;
}

interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    );
}

function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-6 border-b border-border",
                className
            )}
        >
            {children}
        </div>
    );
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

function TabsTrigger({ value, children, className }: TabsTriggerProps) {
    const { value: selectedValue, onValueChange } = useTabs();
    const isSelected = selectedValue === value;

    return (
        <button
            onClick={() => onValueChange(value)}
            className={cn(
                "relative inline-flex items-center justify-center whitespace-nowrap px-1 pb-3 text-sm font-medium transition-all",
                "focus-visible:outline-none",
                isSelected
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                className
            )}
        >
            {children}
            {/* Underline indicator */}
            {isSelected && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
        </button>
    );
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

function TabsContent({ value, children, className }: TabsContentProps) {
    const { value: selectedValue } = useTabs();

    if (selectedValue !== value) {
        return null;
    }

    return <div className={cn("mt-4", className)}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
