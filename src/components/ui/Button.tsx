import React from "react";
import { cn } from "@/utils/util";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg" | "default";
    icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "secondary",
            size = "default",
            icon,
            children,
            className,
            disabled,
            ...props
        },
        ref,
    ) => {
        const variants = {
            primary: cn(
                "bg-(--color-accent) text-(--color-text-on-accent)",
                "hover:bg-(--color-accent-hover)",
                "active:brightness-90",
            ),
            secondary: cn(
                "bg-(--color-bg-secondary) text-(--color-text-primary)",
                "border border-(--color-border)",
                "hover:bg-(--color-bg-hover) hover:border-(--color-border-strong)",
                "active:bg-(--color-bg-active)",
            ),
            ghost: cn(
                "text-(--color-text-secondary)",
                "hover:bg-(--color-bg-hover) hover:text-(--color-text-primary)",
                "active:bg-(--color-bg-active)",
            ),
            danger: cn(
                "bg-(--color-danger) text-white",
                "hover:opacity-90",
                "active:opacity-80",
            ),
        };

        const sizes = {
            sm: "h-7 px-2 text-[12px] gap-1.5",
            md: "h-8 px-3 text-[13px] gap-2",
            lg: "h-10 px-4 text-[14px] gap-2.5",
            default: "h-8 px-3 text-[13px] gap-2",
        };

        return (
            <button
                ref={ref}
                disabled={disabled}
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-medium",
                    "transition-colors duration-100",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--color-border-focus) focus-visible:ring-offset-1 focus-visible:ring-offset-(--color-bg-primary)",
                    "disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className,
                )}
                {...props}
            >
                {icon && (
                    <span className="shrink-0 [&>svg]:w-4 [&>svg]:h-4">
                        {icon}
                    </span>
                )}
                {children}
            </button>
        );
    },
);

Button.displayName = "Button";
export default Button;

