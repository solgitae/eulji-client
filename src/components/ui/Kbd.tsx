import React from "react";
import { cn } from "@/utils/util";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export function Kbd({ children, className, ...props }: KbdProps) {
    return (
        <kbd
            className={cn(
                "inline-flex items-center justify-center h-5 min-w-[20px] px-1.5",
                "rounded-sm border border-(--color-border)",
                "bg-(--color-bg-tertiary) text-(--color-text-tertiary)",
                "text-[11px] font-mono font-medium leading-none",
                className,
            )}
            {...props}
        >
            {children}
        </kbd>
    );
}
