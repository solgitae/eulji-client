
import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/utils/util";

interface RadioGroupContextValue {
    value: string;
    onChange: (value: string) => void;
    name: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue>({
    value: "",
    onChange: () => {},
    name: "",
});

export interface RadioGroupProps {
    value: string;
    onChange: (value: string) => void;
    name?: string;
    children: React.ReactNode;
    className?: string;
    orientation?: "vertical" | "horizontal";
}

export function RadioGroup({
    value,
    onChange,
    name = "radio-group",
    children,
    className,
    orientation = "vertical",
}: RadioGroupProps) {
    return (
        <RadioGroupContext.Provider value={{ value, onChange, name }}>
            <div
                role="radiogroup"
                className={cn(
                    "flex gap-2.5",
                    orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
                    className,
                )}
            >
                {children}
            </div>
        </RadioGroupContext.Provider>
    );
}

export interface RadioItemProps {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
    className?: string;
}

export function RadioItem({
    value,
    label,
    description,
    disabled = false,
    className,
}: RadioItemProps) {
    const ctx = useContext(RadioGroupContext);
    const isSelected = ctx.value === value;

    return (
        <label
            className={cn(
                "flex items-start gap-2.5 cursor-pointer group",
                disabled && "opacity-50 cursor-not-allowed",
                className,
            )}
        >
            <div className="relative mt-0.5 shrink-0">
                <input
                    type="radio"
                    name={ctx.name}
                    value={value}
                    checked={isSelected}
                    disabled={disabled}
                    onChange={() => ctx.onChange(value)}
                    className="sr-only peer"
                />
                <div
                    className={cn(
                        "w-4 h-4 rounded-full border-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                        isSelected
                            ? "border-(--color-accent) bg-(--color-accent) scale-110"
                            : "border-(--color-border) bg-(--color-bg-secondary) group-hover:border-(--color-border-strong) scale-100",
                        "peer-focus-visible:ring-2 peer-focus-visible:ring-(--color-border-focus) peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-(--color-bg-primary)",
                    )}
                >
                    <div className={cn(
                        "absolute inset-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                        isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0",
                    )}>
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-(--color-text-primary) select-none">
                    {label}
                </span>
                {description && (
                    <span className="text-xs text-(--color-text-tertiary)">
                        {description}
                    </span>
                )}
            </div>
        </label>
    );
}
