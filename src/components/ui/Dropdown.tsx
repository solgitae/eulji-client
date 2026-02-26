
import React, { useState, useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/util";

interface DropdownContextValue {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
    align: "start" | "end";
    side: "top" | "bottom";
    setSide: (side: "top" | "bottom") => void;
    triggerRef: React.RefObject<HTMLDivElement | null>;
}

const DropdownContext = React.createContext<DropdownContextValue>({
    isOpen: false,
    toggle: () => {},
    close: () => {},
    align: "start",
    side: "bottom",
    setSide: () => {},
    triggerRef: { current: null },
});

export function Dropdown({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [side, setSide] = useState<"top" | "bottom">("bottom");
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const toggle = useCallback(() => setIsOpen((v) => !v), []);
    const close = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                close();
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [isOpen, close]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, close]);

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            if (spaceBelow < 250 && spaceAbove > spaceBelow) {
                setSide("top");
            } else {
                setSide("bottom");
            }
        }
    }, [isOpen]);

    return (
        <DropdownContext.Provider value={{ isOpen, toggle, close, align: "start", side, setSide, triggerRef }}>
            <div ref={containerRef} className="relative">
                {children}
            </div>
        </DropdownContext.Provider>
    );
}

export function DropdownTrigger({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { toggle, triggerRef } = React.useContext(DropdownContext);
    return (
        <div ref={triggerRef} onClick={(e) => { e.stopPropagation(); toggle(); }} className={cn("", className)}>
            {children}
        </div>
    );
}

export function DropdownButton({
    children,
    leftIcon,
    rightIcon,
    className,
    leftIconClassName,
    rightIconClassName,
    size = "md",
    ...props
}: {
    children: React.ReactNode;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    className?: string;
    leftIconClassName?: string;
    rightIconClassName?: string;
    size?: "sm" | "md" | "lg";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                "flex items-center gap-2 rounded-md transition-all duration-100",
                "text-sm font-medium text-(--color-text-primary)",
                "hover:bg-(--color-bg-hover)",
                size === "sm" && "h-7 px-2 text-[12px]",
                size === "md" && "h-8 px-2 text-[13px]",
                size === "lg" && "h-10 px-3 text-[14px]",
                className,
            )}
            {...props}
        >
            {leftIcon && (
                <span className={cn("flex items-center justify-center shrink-0", 
                    size === "sm" ? "w-5 h-5" : size === "lg" ? "w-6 h-6" : "w-5.5 h-5.5",
                    leftIconClassName)}>
                    {leftIcon}
                </span>
            )}
            {children}
            {rightIcon && (
                <span className={cn("flex items-center justify-center shrink-0 text-(--color-icon-secondary)", 
                    size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4.5 h-4.5" : "w-4 h-4",
                    rightIconClassName)}>
                    {rightIcon}
                </span>
            )}
        </button>
    );
}

export function DropdownContent({
    children,
    className,
    align = "start",
    matchTriggerWidth = false,
}: {
    children: React.ReactNode;
    className?: string;
    align?: "start" | "center" | "end";
    matchTriggerWidth?: boolean;
}) {
    const { isOpen, side, triggerRef } = React.useContext(DropdownContext);
    const [width, setWidth] = useState<number | null>(null);

    useLayoutEffect(() => {
        if (isOpen && matchTriggerWidth && triggerRef.current) {
            setWidth(triggerRef.current.offsetWidth);
        }
    }, [isOpen, matchTriggerWidth, triggerRef]);

    if (!isOpen) return null;

    return (
        <div
            className={cn(
                "absolute z-50 min-w-[180px] rounded-lg p-1",
                "bg-(--color-bg-tertiary) border border-(--color-border)",
                "shadow-(--shadow-elevated)",
                side === "top" ? "bottom-full mb-1" : "top-full mt-1",
                side === "top" ? "animate-in fade-in slide-in-from-bottom-1 duration-100" : "animate-in fade-in slide-in-from-top-1 duration-100",
                align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0",
                className,
            )}
            style={width ? { width: `${width}px` } : undefined}
        >
            {children}
        </div>
    );
}

/**
 * DropdownSelect
 * A high-fidelity replacement for the standard HTML Select.
 * Integrated with the Dropdown system for consistent styling and animations.
 */
export function DropdownSelect({
    label,
    value,
    onChange,
    options,
    placeholder,
    error,
    className,
    triggerClassName,
    disabled = false,
}: {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    error?: string;
    className?: string;
    triggerClassName?: string;
    disabled?: boolean;
}) {
    const selectedOption = options.find((o) => o.value === value);

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {label && (
                <label className="text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                    {label}
                </label>
            )}
            <Dropdown>
                <DropdownTrigger className={cn("w-full", disabled && "opacity-50 pointer-events-none")}>
                    <div
                        className={cn(
                            "flex items-center justify-between w-full h-8 px-3 rounded-md text-[13px] border transition-all cursor-pointer",
                            "bg-(--color-bg-secondary) border-(--color-border) text-(--color-text-primary)",
                            "hover:border-(--color-border-strong)",
                            error && "border-(--color-danger)",
                            triggerClassName,
                        )}
                    >
                        <span className={cn("truncate", !selectedOption && "text-(--color-text-disabled)")}>
                            {selectedOption ? selectedOption.label : placeholder || "선택..."}
                        </span>
                        <ChevronDown className="w-3.5 h-3.5 text-(--color-text-tertiary) shrink-0" />
                    </div>
                </DropdownTrigger>
                <DropdownContent matchTriggerWidth className="max-h-[250px] overflow-y-auto custom-scrollbar">
                    {options.map((opt) => (
                        <DropdownItem
                            key={opt.value}
                            onClick={() => onChange(opt.value)}
                            className={cn(
                                opt.value === value && "bg-(--color-bg-active) text-(--color-accent) font-semibold"
                            )}
                        >
                            {opt.label}
                        </DropdownItem>
                    ))}
                </DropdownContent>
            </Dropdown>
            {error && <p className="text-[11px] text-(--color-danger)">{error}</p>}
        </div>
    );
}

export function DropdownItem({
    children,
    onClick,
    icon: Icon,
    className,
    destructive = false,
}: {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
    icon?: React.ComponentType<{ className?: string }>;
    className?: string;
    destructive?: boolean;
}) {
    const { close } = React.useContext(DropdownContext);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick?.(e);
        close();
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md transition-colors duration-100",
                destructive
                    ? "text-(--color-danger) hover:bg-(--color-danger-bg)"
                    : "text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-bg-hover)",
                className,
            )}
        >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span className="truncate">{children}</span>
        </button>
    );
}

export function DropdownLabel({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "px-2 py-1.5 text-xs font-medium text-(--color-text-tertiary)",
                className,
            )}
        >
            {children}
        </div>
    );
}

export function DropdownSeparator({ className }: { className?: string }) {
    return (
        <div
            className={cn("h-px bg-(--color-border) my-1 -mx-1", className)}
        />
    );
}
