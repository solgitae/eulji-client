import React from "react";
import { cn } from "@/utils/util";

export interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: "xs" | "sm" | "md" | "lg";
    className?: string;
}

const SIZES = {
    xs: "w-5 h-5 text-[9px]",
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-[12px]",
    lg: "w-10 h-10 text-[13px]",
};

function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 1).toUpperCase();
}

function getColorIndex(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 6;
}

const COLORS = [
    "bg-[lch(45%_40_270)] text-white",  
    "bg-[lch(45%_40_330)] text-white",  
    "bg-[lch(45%_40_150)] text-white",  
    "bg-[lch(50%_40_30)] text-white",   
    "bg-[lch(55%_40_60)] text-white",   
    "bg-[lch(45%_40_210)] text-white",  
];

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ src, alt, name, size = "md", className }, ref) => {
        const sizeClass = SIZES[size];

        if (src) {
            return (
                <img
                    src={src}
                    alt={alt || name || "Avatar"}
                    className={cn(
                        "rounded-full object-cover shrink-0",
                        sizeClass,
                        className,
                    )}
                />
            );
        }

        const initials = name ? getInitials(name) : "?";
        const colorClass = name ? COLORS[getColorIndex(name)] : "bg-(--color-bg-tertiary) text-(--color-text-secondary)";

        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-full shrink-0 flex items-center justify-center font-semibold select-none",
                    sizeClass,
                    colorClass,
                    className,
                )}
                aria-label={name || "Avatar"}
            >
                {initials}
            </div>
        );
    },
);

Avatar.displayName = "Avatar";
export default Avatar;
