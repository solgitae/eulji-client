import React from "react";
import { cn } from "@/utils/util";

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
    label?: string;
    description?: string;
    error?: string;
    icon?: React.ReactNode;
    iconPosition?: "left" | "right";
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: "default" | "currency";
    currencySymbol?: string;
    size?: "sm" | "md" | "lg";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            description,
            error,
            icon,
            iconPosition = "left",
            leftIcon,
            rightIcon,
            variant = "default",
            currencySymbol = "₩",
            size = "md",
            className,
            id,
            ...props
        },
        ref,
    ) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        const isCurrency = variant === "currency";
        const effectiveLeftIcon = isCurrency 
            ? <span className="text-(--color-text-tertiary) font-medium text-[13px]">{currencySymbol}</span> 
            : (leftIcon || (icon && iconPosition === "left" ? icon : undefined));
            
        const effectiveRightIcon = rightIcon || (icon && iconPosition === "right" ? icon : undefined);

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-(--color-text-primary) tracking-tight"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {effectiveLeftIcon && (
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-(--color-icon-secondary) pointer-events-none flex items-center justify-center">
                            {effectiveLeftIcon}
                        </div>
                    )}

                    {effectiveRightIcon && (
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-(--color-icon-secondary) pointer-events-none flex items-center justify-center">
                            {effectiveRightIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            "w-full rounded-md text-[13px] transition-colors duration-100 tracking-tight",
                            "bg-(--color-bg-secondary) text-(--color-text-primary)",
                            "border border-(--color-border)",
                            "placeholder:text-(--color-text-disabled)",
                            "hover:border-(--color-border-strong)",
                            "focus:outline-none focus:border-(--color-border-focus) focus:ring-1 focus:ring-(--color-border-focus)",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            size === "sm" && "h-7 px-2.5 text-[12px]",
                            size === "md" && "h-8 px-3 text-[13px]",
                            size === "lg" && "h-10 px-4 text-[14px]",
                            error &&
                                "border-(--color-danger) focus:border-(--color-danger) focus:ring-(--color-danger)",
                            effectiveLeftIcon && (size === "sm" ? "pl-7" : size === "lg" ? "pl-10" : "pl-8"),
                            effectiveRightIcon && (size === "sm" ? "pr-7" : size === "lg" ? "pr-10" : "pr-8"),
                            isCurrency && "font-mono font-bold text-(--color-accent)",
                            className,
                        )}
                        aria-invalid={error ? "true" : undefined}
                        aria-describedby={
                            error
                                ? `${inputId}-error`
                                : description
                                  ? `${inputId}-desc`
                                  : undefined
                        }
                        {...props}
                    />
                </div>

                {description && !error && (
                    <p
                        id={`${inputId}-desc`}
                        className="text-xs text-(--color-text-tertiary) tracking-tight"
                    >
                        {description}
                    </p>
                )}

                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="text-xs text-(--color-danger) tracking-tight"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = "Input";
export default Input;

