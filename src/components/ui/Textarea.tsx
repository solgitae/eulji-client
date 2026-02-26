import React from "react";
import { cn } from "@/utils/util";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    description?: string;
    error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, description, error, className, id, ...props }, ref) => {
        const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="text-[13px] font-medium text-(--color-text-primary)"
                    >
                        {label}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={textareaId}
                    className={cn(
                        "w-full min-h-[80px] px-3 py-2 rounded-md text-[13px] transition-colors duration-100 resize-y",
                        "bg-(--color-bg-secondary) text-(--color-text-primary)",
                        "border border-(--color-border)",
                        "placeholder:text-(--color-text-disabled)",
                        "hover:border-(--color-border-strong)",
                        "focus:outline-none focus:border-(--color-border-focus) focus:ring-1 focus:ring-(--color-border-focus)",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error && "border-(--color-danger) focus:border-(--color-danger) focus:ring-(--color-danger)",
                        className,
                    )}
                    aria-invalid={error ? "true" : undefined}
                    aria-describedby={
                        error
                            ? `${textareaId}-error`
                            : description
                              ? `${textareaId}-desc`
                              : undefined
                    }
                    {...props}
                />

                {description && !error && (
                    <p
                        id={`${textareaId}-desc`}
                        className="text-[11px] text-(--color-text-tertiary)"
                    >
                        {description}
                    </p>
                )}

                {error && (
                    <p
                        id={`${textareaId}-error`}
                        className="text-[11px] text-(--color-danger)"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

Textarea.displayName = "Textarea";
export default Textarea;
