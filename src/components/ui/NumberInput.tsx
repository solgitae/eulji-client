import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/utils/util";

export interface NumberInputProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    suffix?: string;
    className?: string;
    disabled?: boolean;
}

export function NumberInput({
    value,
    onChange,
    min = -Infinity,
    max = Infinity,
    step = 1,
    label,
    suffix,
    className,
    disabled = false,
}: NumberInputProps) {
    const decrement = () => {
        const next = value - step;
        if (next >= min) onChange(next);
    };

    const increment = () => {
        const next = value + step;
        if (next <= max) onChange(next);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9.-]/g, "");
        const num = parseFloat(raw);
        if (!isNaN(num)) {
            onChange(Math.min(max, Math.max(min, num)));
        }
    };

    const canDecrement = value - step >= min;
    const canIncrement = value + step <= max;

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {label && (
                <label className="text-[13px] font-medium text-(--color-text-primary)">
                    {label}
                </label>
            )}
            <div
                className={cn(
                    "inline-flex items-center h-8 rounded-md border border-(--color-border) bg-(--color-bg-secondary) transition-colors duration-100",
                    "focus-within:border-(--color-border-focus) focus-within:ring-1 focus-within:ring-(--color-border-focus)",
                    disabled && "opacity-50 cursor-not-allowed",
                )}
            >
                <button
                    onClick={decrement}
                    disabled={disabled || !canDecrement}
                    className={cn(
                        "h-full px-2 flex items-center justify-center border-r border-(--color-border) transition-colors duration-100",
                        "text-(--color-text-tertiary) hover:text-(--color-text-primary) hover:bg-(--color-bg-hover)",
                        "disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed",
                    )}
                >
                    <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center px-3 gap-1">
                    <input
                        type="text"
                        inputMode="numeric"
                        value={value}
                        onChange={handleInputChange}
                        disabled={disabled}
                        className="w-12 text-center text-[13px] font-medium text-(--color-text-primary) bg-transparent focus:outline-none"
                    />
                    {suffix && (
                        <span className="text-[11px] text-(--color-text-tertiary) shrink-0">
                            {suffix}
                        </span>
                    )}
                </div>

                <button
                    onClick={increment}
                    disabled={disabled || !canIncrement}
                    className={cn(
                        "h-full px-2 flex items-center justify-center border-l border-(--color-border) transition-colors duration-100",
                        "text-(--color-text-tertiary) hover:text-(--color-text-primary) hover:bg-(--color-bg-hover)",
                        "disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed",
                    )}
                >
                    <Plus className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
