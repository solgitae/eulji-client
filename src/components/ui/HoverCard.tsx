
import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/utils/util";

interface HoverCardContextValue {
    isOpen: boolean;
    triggerRef: React.RefObject<HTMLDivElement | null>;
}

const HoverCardContext = React.createContext<HoverCardContextValue>({
    isOpen: false,
    triggerRef: { current: null },
});

export function HoverCard({
    children,
    openDelay = 300,
    closeDelay = 200,
}: {
    children: React.ReactNode;
    openDelay?: number;
    closeDelay?: number;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const openTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const handleEnter = useCallback(() => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        openTimerRef.current = setTimeout(() => setIsOpen(true), openDelay);
    }, [openDelay]);

    const handleLeave = useCallback(() => {
        if (openTimerRef.current) clearTimeout(openTimerRef.current);
        closeTimerRef.current = setTimeout(() => setIsOpen(false), closeDelay);
    }, [closeDelay]);

    useEffect(() => {
        return () => {
            if (openTimerRef.current) clearTimeout(openTimerRef.current);
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        };
    }, []);

    return (
        <HoverCardContext.Provider value={{ isOpen, triggerRef }}>
            <div
                className="relative inline-flex"
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
            >
                {children}
            </div>
        </HoverCardContext.Provider>
    );
}

export function HoverCardTrigger({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { triggerRef } = React.useContext(HoverCardContext);

    return (
        <div ref={triggerRef} className={cn("cursor-pointer", className)}>
            {children}
        </div>
    );
}

export function HoverCardContent({
    children,
    className,
    align = "center",
    side = "bottom",
}: {
    children: React.ReactNode;
    className?: string;
    align?: "start" | "center" | "end";
    side?: "top" | "bottom";
}) {
    const { isOpen } = React.useContext(HoverCardContext);

    if (!isOpen) return null;

    const alignClass = {
        start: "left-0",
        center: "left-1/2 -translate-x-1/2",
        end: "right-0",
    };

    const sideClass = {
        top: "bottom-full mb-2",
        bottom: "top-full mt-2",
    };

    return (
        <div
            className={cn(
                "absolute z-50 w-72 rounded-xl p-4",
                "bg-(--color-bg-secondary) border border-(--color-border)",
                "shadow-(--shadow-elevated)",
                "animate-in fade-in zoom-in-95 duration-150",
                alignClass[align],
                sideClass[side],
                className,
            )}
        >
            {children}
        </div>
    );
}
