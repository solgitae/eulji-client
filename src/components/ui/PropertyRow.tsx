import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/util";

export interface PropertyRowProps {
    icon?: React.ReactNode;
    label: string;
    value: React.ReactNode;
    options?: { value: string; label: string }[];
    onSelect?: (v: string) => void;
    readonly?: boolean;
    multiSelect?: boolean;
    selectedValues?: string[];
    variant?: "default" | "ghost"; // Add ghost variant
}

export function PropertyRow({
    icon,
    label,
    value,
    options,
    onSelect,
    readonly = false,
    multiSelect = false,
    selectedValues = [],
    variant = "default",
}: PropertyRowProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const [isTop, setIsTop] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        const updateRect = () => {
            if (buttonRef.current) {
                const buttonRect = buttonRef.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - buttonRect.bottom;
                const spaceAbove = buttonRect.top;

                setIsTop(spaceBelow < 250 && spaceAbove > spaceBelow);
                setRect(buttonRect);
            }
        };
        updateRect();
        window.addEventListener("scroll", updateRect, true);
        window.addEventListener("resize", updateRect);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", updateRect, true);
            window.removeEventListener("resize", updateRect);
        };
    }, [isOpen]);

    const handleOpenToggle = () => {
        if (!isOpen && buttonRef.current) {
            setRect(buttonRef.current.getBoundingClientRect());
        }
        setIsOpen(!isOpen);
    };

    const handleSelect = (val: string) => {
        onSelect?.(val);
        if (!multiSelect) {
            setIsOpen(false);
        }
    };

    const isInteractive = !readonly && options && options.length > 0;

    const baseStyles = cn(
        "inline-flex items-center h-[28px] rounded-md text-[12px] transition-all duration-150 outline-none w-full text-left",
        variant === "default" && "border border-(--color-border) bg-(--color-bg-secondary)",
        variant === "ghost" && "hover:bg-(--color-bg-hover)",
        isOpen && "border-(--color-border-focus) ring-1 ring-(--color-border-focus) bg-(--color-bg-tertiary)",
    );

    return (
        <div ref={containerRef} className="relative w-full select-none group/prop">
            {isInteractive ? (
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={handleOpenToggle}
                    className={cn(baseStyles, !isOpen && "hover:border-(--color-border-strong)")}
                >
                    {/* Key */}
                    <div className="flex items-center gap-1.5 px-2.5 h-full text-(--color-text-secondary) min-w-[100px] shrink-0">
                        {icon && <span className="text-(--color-icon-secondary) group-hover/prop:text-(--color-text-secondary) shrink-0 transition-colors">{icon}</span>}
                        <span className="truncate">{label}</span>
                    </div>
                    {/* Value */}
                    <div className={cn(
                        "flex items-center h-full px-2.5 font-medium transition-colors rounded-r-md flex-1 min-w-0 border-l border-(--color-border)/50 group-hover/prop:border-(--color-border-strong)",
                        isOpen ? "text-(--color-text-primary)" : "text-(--color-text-primary)"
                    )}>
                        <span className="truncate inline-block align-middle">{value}</span>
                    </div>
                </button>
            ) : (
                <div
                    className={cn(baseStyles, "cursor-default opacity-80")}
                >
                    {/* Key */}
                    <div className="flex items-center gap-1.5 px-2.5 h-full text-(--color-text-secondary) min-w-[100px] shrink-0">
                        {icon && <span className="text-(--color-icon-tertiary) shrink-0">{icon}</span>}
                        <span className="truncate">{label}</span>
                    </div>
                    {/* Value */}
                    <div className="flex items-center h-full px-2.5 font-medium text-(--color-text-primary) border-l border-(--color-border)/30 flex-1 min-w-0">
                        <span className="truncate inline-block align-middle">{value}</span>
                    </div>
                </div>
            )}

            {/* Options Dropdown via Portal */}
            {options && isOpen && !readonly && rect && typeof document !== "undefined" && createPortal(
                <div
                    className={cn(
                        "fixed z-100 min-w-[160px] bg-(--color-bg-secondary) border border-(--color-border) shadow-(--shadow-elevated) rounded-lg p-1 animate-in fade-in duration-150",
                        isTop ? "slide-in-from-bottom-1" : "slide-in-from-top-1"
                    )}
                    style={{
                        top: isTop ? undefined : rect.bottom + 4,
                        bottom: isTop ? window.innerHeight - rect.top + 4 : undefined,
                        left: rect.left,
                        maxHeight: isTop ? rect.top - 12 : window.innerHeight - rect.bottom - 12,
                        minWidth: rect.width,
                        overflowY: "auto",
                    }}
                >
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => handleSelect(opt.value)}
                            className={cn(
                                "w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between hover:bg-(--color-bg-hover) rounded-md transition-all",
                                multiSelect && selectedValues.includes(opt.value)
                                    ? "text-(--color-accent) font-semibold"
                                    : "text-(--color-text-secondary) hover:text-(--color-text-primary)"
                            )}
                        >
                            <span className="truncate">{opt.label}</span>
                            {multiSelect && selectedValues.includes(opt.value) && (
                                <div className="w-1.5 h-1.5 rounded-full bg-(--color-accent) shrink-0 ml-2" />
                            )}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
}

export default PropertyRow;
