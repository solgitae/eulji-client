
import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, Check, ChevronDown } from "lucide-react";
import { cn } from "@/utils/util";

export interface ComboboxOption {
    value: string;
    label: string;
    description?: string;
}

export interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    className?: string;
    emptyMessage?: string;
    label?: string;            // Add label support to match Select
    allowCustom?: boolean;     // Allow entering custom values not in options
    size?: "sm" | "md" | "lg";
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = "선택하세요",
    searchPlaceholder = "검색...",
    className,
    emptyMessage = "결과가 없습니다",
    label,
    allowCustom = false,
    size = "md",
}: ComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [coords, setCoords] = useState({ top: 0, bottom: 0, left: 0, width: 0, isTop: false });

    const selected = options.find((o) => o.value === value);

    const filtered = useMemo(() => {
        if (!query.trim()) return options;
        const q = query.toLowerCase();
        return options.filter(
            (o) =>
                o.label.toLowerCase().includes(q) ||
                o.description?.toLowerCase().includes(q),
        );
    }, [options, query]);

    const open = useCallback(() => {
        setIsOpen(true);
        setQuery("");
        setActiveIndex(0);
        requestAnimationFrame(() => inputRef.current?.focus());
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        // If allowCustom and query has text but no selection was made by click/Enter,
        // we could optionally auto-select the query here. But usually Enter is preferred.
        setQuery("");
    }, []);

    const select = useCallback(
        (val: string) => {
            onChange?.(val);
            close();
        },
        [onChange, close],
    );

    const [isPositioned, setIsPositioned] = useState(false);

    const updateCoords = useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const isTop = spaceBelow < 250 && spaceAbove > spaceBelow;

            setCoords({
                top: rect.bottom,
                bottom: window.innerHeight - rect.top,
                left: rect.left,
                width: rect.width,
                isTop
            });
            setIsPositioned(true);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            updateCoords();
            window.addEventListener("scroll", updateCoords, true);
            window.addEventListener("resize", updateCoords);
            return () => {
                window.removeEventListener("scroll", updateCoords, true);
                window.removeEventListener("resize", updateCoords);
                setIsPositioned(false);
            };
        } else {
            setIsPositioned(false);
        }
    }, [isOpen, updateCoords]);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent | FocusEvent) => {
            if (
                containerRef.current && 
                !containerRef.current.contains(e.target as Node) &&
                (!dropdownRef.current || !dropdownRef.current.contains(e.target as Node))
            ) {
                close();
            }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("focusin", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("focusin", handler);
        };
    }, [isOpen, close]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            close();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 0, 0)); // keep existing active index logic
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (filtered[activeIndex]) {
                select(filtered[activeIndex].value);
            } else if (allowCustom && query.trim()) {
                select(query.trim());
            }
        }
    };

    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            {label && (
                <label className="text-xs font-medium text-(--color-text-secondary)">
                    {label}
                </label>
            )}
            <div ref={containerRef} className="relative w-full">
                <button
                    onClick={() => (isOpen ? close() : open())}
                    type="button"
                    className={cn(
                        "flex items-center justify-between w-full rounded-md text-[13px] transition-colors duration-100",
                        "bg-(--color-bg-secondary) border border-(--color-border)",
                        "hover:border-(--color-border-strong)",
                        "focus:outline-none focus:border-(--color-border-focus) focus:ring-1 focus:ring-(--color-border-focus)",
                        size === "sm" && "h-7 px-2.5 text-[12px]",
                        size === "md" && "h-8 px-3 text-[13px]",
                        size === "lg" && "h-10 px-4 text-[14px]",
                    )}
                >
                    <span className={selected ? "text-(--color-text-primary)" : (value && allowCustom ? "text-(--color-text-primary)" : "text-(--color-text-disabled)")}>
                        {selected ? selected.label : (value && allowCustom ? value : placeholder)}
                    </span>
                    <ChevronDown
                        className={cn(
                            "w-4 h-4 text-(--color-icon-secondary) transition-transform duration-150",
                            isOpen && "rotate-180",
                        )}
                    />
                </button>

            {isOpen && isPositioned && typeof document !== "undefined" && createPortal(
                <div
                    ref={dropdownRef}
                    style={{
                        position: "fixed",
                        top: coords.isTop ? undefined : coords.top + 4,
                        bottom: coords.isTop ? coords.bottom + 4 : undefined,
                        left: coords.left,
                        width: coords.width,
                    }}
                    className={cn(
                        "z-9999 mt-1 rounded-lg overflow-hidden",
                        "bg-(--color-bg-secondary) border border-(--color-border)",
                        "shadow-(--shadow-elevated)",
                        coords.isTop ? "animate-in fade-in slide-in-from-bottom-1 duration-100" : "animate-in fade-in slide-in-from-top-1 duration-100",
                    )}
                >
                    
                    <div className="flex items-center gap-2 px-3 h-9 border-b border-(--color-border)">
                        <Search className="w-3.5 h-3.5 text-(--color-icon-secondary) shrink-0" />
                        <input
                            ref={inputRef}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setActiveIndex(0);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={searchPlaceholder}
                            className="flex-1 bg-transparent text-sm text-(--color-text-primary) placeholder:text-(--color-text-disabled) focus:outline-none"
                        />
                    </div>

                    <div className="max-h-[200px] overflow-y-auto overscroll-contain p-1">
                        {allowCustom && query.trim() && !filtered.find(o => o.label.toLowerCase() === query.toLowerCase().trim()) && (
                            <button
                                type="button"
                                onClick={() => select(query.trim())}
                                className={cn(
                                    "flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-sm transition-colors duration-75",
                                    activeIndex === filtered.length // Next logical index
                                        ? "bg-(--color-bg-hover) text-(--color-text-primary)"
                                        : "text-(--color-accent)",
                                )}
                                onMouseEnter={() => setActiveIndex(filtered.length)}
                            >
                                <span className="w-4 shrink-0" />
                                <div className="flex flex-col text-left">
                                    <span className="font-medium text-(--color-text-primary)">
                                        "{query}" 직접 입력
                                    </span>
                                </div>
                            </button>
                        )}

                        {filtered.length === 0 && (!allowCustom || !query.trim()) ? (
                            <div className="py-4 text-center text-sm text-(--color-text-tertiary)">
                                {emptyMessage}
                            </div>
                        ) : (
                            filtered.map((option, index) => {
                                const isActive = index === activeIndex;
                                const isSelected = option.value === value;

                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => select(option.value)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        className={cn(
                                            "flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-sm transition-colors duration-75",
                                            isActive
                                                ? "bg-(--color-bg-hover) text-(--color-text-primary)"
                                                : "text-(--color-text-secondary)",
                                        )}
                                    >
                                        <span className="w-4 shrink-0">
                                            {isSelected && <Check className="w-4 h-4 text-(--color-accent)" />}
                                        </span>
                                        <div className="flex flex-col text-left">
                                            <span className={cn(isSelected && "font-medium text-(--color-text-primary)")}>
                                                {option.label}
                                            </span>
                                            {option.description && (
                                                <span className="text-xs text-(--color-text-tertiary)">
                                                    {option.description}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>,
                document.body
            )}
            </div>
        </div>
    );
}
