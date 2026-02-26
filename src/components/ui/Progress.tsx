import React from "react";
import { cn } from "@/utils/util";

export interface ProgressProps {
    value: number; 
    className?: string;
    size?: "sm" | "md";
}

export function Progress({ value, className, size = "sm" }: ProgressProps) {
    const clampedValue = Math.min(100, Math.max(0, value));

    const sizes = {
        sm: "h-1",
        md: "h-1.5",
    };

    return (
        <div
            role="progressbar"
            aria-valuenow={clampedValue}
            aria-valuemin={0}
            aria-valuemax={100}
            className={cn(
                "w-full rounded-full bg-(--color-bg-quaternary) overflow-hidden",
                sizes[size],
                className,
            )}
        >
            <div
                className="h-full bg-(--color-accent) rounded-full transition-all duration-300 ease-out"
                style={{ width: `${clampedValue}%` }}
            />
        </div>
    );
}
