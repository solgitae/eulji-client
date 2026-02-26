import { ReactNode } from "react";
import { cn } from "@/utils/util";

interface FormFieldProps {
    label: string;
    description?: string;
    required?: boolean;
    children: ReactNode;
    className?: string;
}

export function FormField({ label, description, required, children, className }: FormFieldProps) {
    return (
        <div className={cn("space-y-1.5", className)}>
            <div className="flex items-center justify-between gap-2">
                <label className="text-[12px] font-medium text-(--color-text-secondary)">
                    {label}
                    {required && <span className="ml-0.5 text-(--color-danger)">*</span>}
                </label>
            </div>
            {description && (
                <p className="text-[11px] text-(--color-text-tertiary)">
                    {description}
                </p>
            )}
            {children}
        </div>
    );
}
