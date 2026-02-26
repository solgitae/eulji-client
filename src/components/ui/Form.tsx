import React from "react";
import { cn } from "@/utils/util";

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    children: React.ReactNode;
}

export function Form({ children, className, ...props }: FormProps) {
    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            {children}
        </form>
    );
}

export interface FormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
}

export function FormSection({
    title,
    description,
    children,
    className,
}: FormSectionProps) {
    return (
        <section className={cn("flex flex-col gap-5", className)}>
            <div className="flex flex-col gap-1">
                <h2 className="text-base font-semibold text-(--color-text-primary)">
                    {title}
                </h2>
                {description && (
                    <p className="text-sm text-(--color-text-secondary)">
                        {description}
                    </p>
                )}
            </div>
            <div className="flex flex-col gap-4">{children}</div>
        </section>
    );
}

export interface FormFieldProps {
    label: string;
    htmlFor?: string;
    description?: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}

export function FormField({
    label,
    htmlFor,
    description,
    error,
    required,
    children,
    className,
}: FormFieldProps) {
    const fieldId = htmlFor || label.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <label
                htmlFor={fieldId}
                className="text-sm font-medium text-(--color-text-primary)"
            >
                {label}
                {required && (
                    <span className="text-(--color-danger) ml-0.5">*</span>
                )}
            </label>

            {children}

            {description && !error && (
                <p className="text-xs text-(--color-text-tertiary)">
                    {description}
                </p>
            )}

            {error && (
                <p className="text-xs text-(--color-danger)">{error}</p>
            )}
        </div>
    );
}

export interface FormActionsProps {
    children: React.ReactNode;
    className?: string;
}

export function FormActions({ children, className }: FormActionsProps) {
    return (
        <div
            className={cn(
                "flex items-center gap-2 pt-4 border-t border-(--color-border)",
                className,
            )}
        >
            {children}
        </div>
    );
}

export function FormDivider({ className }: { className?: string }) {
    return (
        <hr
            className={cn(
                "border-none h-px bg-(--color-border)",
                className,
            )}
        />
    );
}
