import React from "react";
import { cn } from "@/utils/util";

export interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-16 px-6 text-center",
                className,
            )}
        >
            {icon && (
                <div className="mb-4 text-(--color-icon-secondary) [&>svg]:w-10 [&>svg]:h-10">
                    {icon}
                </div>
            )}
            <h3 className="text-sm font-semibold text-(--color-text-primary) mb-1">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-(--color-text-tertiary) max-w-xs mb-4">
                    {description}
                </p>
            )}
            {action && <div>{action}</div>}
        </div>
    );
}
