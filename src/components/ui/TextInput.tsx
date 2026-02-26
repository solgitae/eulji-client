import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/util";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const TextInput = forwardRef<HTMLInputElement, Props>(function TextInput(
    { className, ...props },
    ref
) {
    return (
        <input
            ref={ref}
            {...props}
            className={cn(
                "w-full rounded-md border border-(--color-border) bg-(--color-bg-primary) px-2.5 py-1.5",
                "text-[13px] text-(--color-text-primary) placeholder:text-(--color-text-tertiary)",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--color-border-focus)",
                "transition-colors duration-150",
                className
            )}
        />
    );
});
