import React from "react";
import { cn } from "@/utils/util";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    "text-[13px] font-medium leading-none text-(--color-text-primary) peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    className
                )}
                {...props}
            >
                {children}
            </label>
        );
    }
);

Label.displayName = "Label";

export default Label;
