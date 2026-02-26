"use client"

import React from "react";
import { cn } from "@/utils/util";

export interface SkeletonProps {
    className?: string;
    variant?: "text" | "circle" | "rect";
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className,
    variant = "rect",
    width,
    height,
}: SkeletonProps) {
    const variants = {
        text: "h-4 rounded-md",
        circle: "rounded-full",
        rect: "rounded-md",
    };

    return (
        <div
            className={cn(
                "animate-pulse bg-(--color-bg-tertiary)",
                variants[variant],
                className,
            )}
            style={{ width, height }}
        />
    );
}
