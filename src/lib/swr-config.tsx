"use client";

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';

interface SWRProviderProps {
    children: ReactNode;
}

export function SWRProvider({ children }: SWRProviderProps) {
    return (
        <SWRConfig
            value={{
                // Revalidate on focus (when user switches back to tab)
                revalidateOnFocus: false,
                // Revalidate on reconnect
                revalidateOnReconnect: true,
                // Keep previous data while fetching new data
                keepPreviousData: true,
                // Dedupe requests within 2 seconds
                dedupingInterval: 2000,
                // Error retry configuration
                errorRetryCount: 3,
                errorRetryInterval: 1000,
                // Cache time - data stays fresh for 30 seconds
                focusThrottleInterval: 30000,
            }}
        >
            {children}
        </SWRConfig>
    );
}
