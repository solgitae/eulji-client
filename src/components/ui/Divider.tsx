import React from "react";
import { cn } from "@/utils/util";

export interface DividerProps {
    orientation?: "horizontal" | "vertical";
    label?: string;
    className?: string;
}

export function Divider({
    orientation = "horizontal",
    label,
    className,
}: DividerProps) {
    if (orientation === "vertical") {
        return (
            <div
                className={cn(
                    "w-px self-stretch bg-(--color-border)",
                    className,
                )}
            />
        );
    }

    if (label) {
        return (
            <div className={cn("flex items-center gap-3", className)}>
                <div className="flex-1 h-px bg-(--color-border)" />
                <span className="text-[11px] font-medium text-(--color-text-tertiary) shrink-0 uppercase tracking-wider">
                    {label}
                </span>
                <div className="flex-1 h-px bg-(--color-border)" />
            </div>
        );
    }

    return (
        <hr
            className={cn(
                "border-none h-px bg-(--color-border)",
                className,
            )}
        />
    );
}
