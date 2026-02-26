import React from "react";
import { cn } from "@/utils/util";

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "children"> {
    label?: string;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
    ({ label, className, id, ...props }, ref) => {
        const toggleId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

        return (
            <div className="flex items-center gap-2.5">
                <label htmlFor={toggleId} className="relative inline-flex items-center cursor-pointer">
                    <input
                        ref={ref}
                        type="checkbox"
                        id={toggleId}
                        className="sr-only peer"
                        {...props}
                    />
                    <div
                        className={cn(
                            "w-9 h-5 rounded-full transition-colors duration-300 ease-out",
                            "bg-(--color-bg-quaternary)",
                            "peer-checked:bg-(--color-accent)",
                            "peer-focus-visible:ring-2 peer-focus-visible:ring-(--color-border-focus) peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-(--color-bg-primary)",
                            "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
                            "after:content-[''] after:absolute after:top-0.5 after:left-0.5",
                            "after:w-4 after:h-4 after:rounded-full after:bg-white",
                            "after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                            "peer-checked:after:translate-x-4",
                            "after:shadow-sm",
                            className,
                        )}
                    />
                </label>
                {label && (
                    <label
                        htmlFor={toggleId}
                        className="text-sm font-medium text-(--color-text-secondary) cursor-pointer select-none"
                    >
                        {label}
                    </label>
                )}
            </div>
        );
    },
);

Toggle.displayName = "Toggle";
export default Toggle;
