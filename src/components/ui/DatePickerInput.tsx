
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { Calendar } from "lucide-react";
import { cn } from "@/utils/util";
import { DatePicker } from "./DatePicker";

interface DatePickerInputProps {
    value?: string; // Expect YYYY-MM-DD or empty
    onChange?: (dateValue: string) => void;
    placeholder?: string;
    label?: string;
    className?: string;
}

export function DatePickerInput({ value = "", onChange, placeholder, label, className }: DatePickerInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [isPositioned, setIsPositioned] = useState(false);
    
    // Position handling
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const [direction, setDirection] = useState<"down" | "up">("down");

    // Sync input when prop value changes externally
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const close = useCallback(() => setIsOpen(false), []);
    const open = useCallback(() => setIsOpen(true), []);

    const updateCoords = useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            // Calculate direction based on viewport space
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            const dropdownHeight = 320; // Approx calendar height

            let newDirection: "down" | "up" = "down";
            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                newDirection = "up";
            }
            setDirection(newDirection);

            setCoords({
                top: newDirection === "down" ? rect.bottom + window.scrollY + 4 : rect.top + window.scrollY - 4,
                left: rect.left + window.scrollX,
                width: rect.width,
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove all non-digit characters
        let val = e.target.value.replace(/\D/g, "");
        
        // Limit to 8 digits max (YYYYMMDD)
        if (val.length > 8) {
            val = val.slice(0, 8);
        }

        // Auto format with hyphens: YYYY-MM-DD
        let formatted = val;
        if (val.length >= 5 && val.length <= 6) {
            formatted = `${val.slice(0, 4)}-${val.slice(4)}`;
        } else if (val.length >= 7) {
            formatted = `${val.slice(0, 4)}-${val.slice(4, 6)}-${val.slice(6)}`;
        }

        setInputValue(formatted);
    };

    const handleBlur = () => {
        const trim = inputValue.trim();
        
        if (!trim) {
            onChange?.("");
            return;
        }

        // Must be fully formed YYYY-MM-DD to be evaluated strictly
        const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
        const match = trim.match(regex);

        if (match) {
            const year = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const day = parseInt(match[3], 10);

            // Create date and verify it didn't overflow (e.g. Feb 30 -> Mar 2)
            const dateObj = new Date(year, month - 1, day);
            const isValidDate = 
                dateObj.getFullYear() === year && 
                dateObj.getMonth() === month - 1 && 
                dateObj.getDate() === day;

            if (isValidDate) {
                const yyyy = dateObj.getFullYear();
                const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
                const dd = String(dateObj.getDate()).padStart(2, "0");
                const finalFormatted = `${yyyy}-${mm}-${dd}`;
                
                setInputValue(finalFormatted);
                onChange?.(finalFormatted);
                return;
            }
        }

        // If invalid date or incomplete format, revert to last known valid prop value
        setInputValue(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleBlur();
            close();
        } else if (e.key === "Escape") {
            close();
        }
    };

    const handleDateSelect = (date: Date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const formatted = `${yyyy}-${mm}-${dd}`;
        setInputValue(formatted);
        onChange?.(formatted);
        close();
    };

    // Convert string to Date for DatePicker if valid
    const parsedDate = useMemo(() => {
        const d = new Date(value);
        return isNaN(d.getTime()) ? undefined : d;
    }, [value]);

    return (
        <div className={cn("flex flex-col gap-1.5", className)} ref={containerRef}>
            {label && (
                <label className="text-xs font-medium text-(--color-text-primary)">
                    {label}
                </label>
            )}
            <div className="relative w-full">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={open}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || "YYYY-MM-DD"}
                    className={cn(
                        "w-full h-8 px-3 pr-8 rounded-md text-sm transition-colors duration-100 placeholder:text-(--color-text-disabled)",
                        "bg-(--color-bg-secondary) text-(--color-text-primary)",
                        "border border-(--color-border)",
                        "hover:border-(--color-border-strong)",
                        "focus:outline-none focus:border-(--color-border-focus) focus:ring-1 focus:ring-(--color-border-focus)",
                    )}
                />
                <div 
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-(--color-icon-secondary) hover:text-(--color-text-primary) cursor-pointer"
                    onClick={() => (isOpen ? close() : open())}
                >
                    <Calendar className="w-3.5 h-3.5" />
                </div>
            </div>

            {isOpen && isPositioned && typeof document !== "undefined" && createPortal(
                <div
                    ref={dropdownRef}
                    style={{
                        position: "absolute",
                        top: coords.top,
                        left: coords.left,
                        transform: direction === "up" ? "translateY(-100%)" : "none",
                    }}
                    className={cn(
                        "z-9999 origin-top",
                        direction === "down" 
                            ? "animate-in fade-in slide-in-from-top-1 duration-100"
                            : "animate-in fade-in slide-in-from-bottom-1 duration-100"
                    )}
                >
                    <DatePicker value={parsedDate} onChange={handleDateSelect} />
                </div>,
                document.body
            )}
        </div>
    );
}
