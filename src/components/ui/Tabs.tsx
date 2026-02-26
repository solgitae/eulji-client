
import React, { useState, createContext, useContext, useCallback } from "react";
import { cn } from "@/utils/util";

interface TabsContextValue {
    activeTab: string;
    setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue>({
    activeTab: "",
    setActiveTab: () => {},
});

export interface TabsProps {
    defaultValue: string;
    children: React.ReactNode;
    className?: string;
    onChange?: (value: string) => void;
}

export function Tabs({ defaultValue, children, className, onChange }: TabsProps) {
    const [activeTab, setActiveTabState] = useState(defaultValue);

    const setActiveTab = useCallback(
        (id: string) => {
            setActiveTabState(id);
            onChange?.(id);
        },
        [onChange],
    );

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={cn("flex flex-col", className)}>{children}</div>
        </TabsContext.Provider>
    );
}

export interface TabListProps {
    children: React.ReactNode;
    className?: string;
}

export function TabList({ children, className }: TabListProps) {
    return (
        <div
            role="tablist"
            className={cn(
                "flex items-center gap-0 border-b border-(--color-border)",
                className,
            )}
        >
            {children}
        </div>
    );
}

export interface TabProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

export function Tab({ value, children, className, disabled }: TabProps) {
    const { activeTab, setActiveTab } = useContext(TabsContext);
    const isActive = activeTab === value;

    return (
        <button
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => setActiveTab(value)}
            className={cn(
                "relative px-3 py-2 text-[13px] font-medium transition-colors duration-100",
                "hover:text-(--color-text-primary)",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--color-border-focus)",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isActive
                    ? "text-(--color-text-primary)"
                    : "text-(--color-text-tertiary)",
                className,
            )}
        >
            {children}
            {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--color-accent) rounded-full" />
            )}
        </button>
    );
}

export interface TabPanelProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
    const { activeTab } = useContext(TabsContext);

    if (activeTab !== value) return null;

    return (
        <div
            role="tabpanel"
            className={cn("pt-4", className)}
        >
            {children}
        </div>
    );
}
