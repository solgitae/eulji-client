import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/utils/util";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "children"> {
    label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, className, id, ...props }, ref) => {
        const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

        return (
            <div className="flex items-center gap-2 group">
                <div className="relative flex items-center justify-center">
                    <input
                        type="checkbox"
                        ref={ref}
                        id={checkboxId}
                        className={cn(
                            "peer appearance-none w-4 h-4 rounded-sm border border-(--color-border) transition-all duration-100",
                            "bg-(--color-bg-secondary) hover:border-(--color-border-strong)",
                            "checked:bg-(--color-accent) checked:border-transparent",
                            "focus:outline-none focus:ring-2 focus:ring-(--color-border-focus) focus:ring-offset-0",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            className
                        )}
                        {...props}
                    />
                    <Check 
                        className={cn(
                            "absolute w-3 h-3 text-white pointer-events-none opacity-0 transition-opacity duration-100",
                            "peer-checked:opacity-100"
                        )} 
                        strokeWidth={4}
                    />
                </div>
                {label && (
                    <label
                        htmlFor={checkboxId}
                        className="text-[13px] font-medium text-(--color-text-secondary) group-hover:text-(--color-text-primary) cursor-pointer select-none transition-colors duration-100 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
                    >
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
