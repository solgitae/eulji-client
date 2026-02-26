
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/util";

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    delayMs?: number;
    className?: string;
    wrapperClassName?: string;
}

export default function Tooltip({
    content,
    children,
    side = "top",
    delayMs = 400,
    className,
    wrapperClassName,
}: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const show = () => {
        timeoutRef.current = setTimeout(() => setVisible(true), delayMs);
    };

    const hide = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const sideClasses: Record<string, string> = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
        left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
        right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
    };

    return (
        <div
            className={cn("relative inline-flex", wrapperClassName)}
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
        >
            {children}

            {visible && (
                <div
                    role="tooltip"
                    className={cn(
                        "absolute z-50 pointer-events-none",
                        "px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap tracking-tight",
                        "bg-(--color-bg-quaternary) text-(--color-text-primary)",
                        "border border-(--color-border)",
                        "shadow-(--shadow-card)",
                        "animate-in fade-in duration-100",
                        sideClasses[side],
                        className,
                    )}
                >
                    {content}
                </div>
            )}
        </div>
    );
}
