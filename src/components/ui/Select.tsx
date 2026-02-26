import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/util";

export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    description?: string;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            label,
            description,
            error,
            options,
            placeholder,
            className,
            id,
            ...props
        },
        ref,
    ) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="text-sm font-medium text-(--color-text-primary)"
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        className={cn(
                            "w-full h-8 px-3 pr-8 rounded-md text-sm transition-colors duration-100 appearance-none",
                            "bg-(--color-bg-secondary) text-(--color-text-primary)",
                            "border border-(--color-border)",
                            "hover:border-(--color-border-strong)",
                            "focus:outline-none focus:border-(--color-border-focus) focus:ring-1 focus:ring-(--color-border-focus)",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            error && "border-(--color-danger) focus:border-(--color-danger) focus:ring-(--color-danger)",
                            className,
                        )}
                        aria-invalid={error ? "true" : undefined}
                        aria-describedby={
                            error
                                ? `${selectId}-error`
                                : description
                                  ? `${selectId}-desc`
                                  : undefined
                        }
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-(--color-icon-secondary)">
                        <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                </div>

                {description && !error && (
                    <p
                        id={`${selectId}-desc`}
                        className="text-xs text-(--color-text-tertiary)"
                    >
                        {description}
                    </p>
                )}

                {error && (
                    <p
                        id={`${selectId}-error`}
                        className="text-xs text-(--color-danger)"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

Select.displayName = "Select";
export default Select;
