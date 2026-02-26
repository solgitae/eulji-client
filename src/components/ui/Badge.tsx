import React from "react";
import { cn } from "@/utils/util";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
    children: React.ReactNode;
}

const VARIANTS = {
    default: "bg-(--color-bg-tertiary) text-(--color-text-secondary)",
    success: "bg-(--color-status-done-bg) text-(--color-status-done)",
    warning: "bg-(--color-status-pending-bg) text-(--color-status-pending)",
    danger: "bg-(--color-danger-bg) text-(--color-danger)",
    info: "bg-(--color-status-in-progress-bg) text-(--color-status-in-progress)",
    outline: "bg-(--color-bg-secondary) text-(--color-text-primary) border border-(--color-border)",
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ variant = "default", children, className, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    "inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[11px] font-medium whitespace-nowrap tracking-tight leading-none",
                    VARIANTS[variant],
                    className,
                )}
                {...props}
            >
                {children}
            </span>
        );
    },
);

Badge.displayName = "Badge";
export default Badge;
