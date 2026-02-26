
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/util";

export interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
    disabled?: boolean;
}

export function AccordionItem({
    title,
    children,
    defaultOpen = false,
    className,
    disabled = false,
}: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={cn("border-b border-(--color-border)", className)}>
            <button
                onClick={() => !disabled && setIsOpen((v) => !v)}
                disabled={disabled}
                className={cn(
                    "flex items-center justify-between w-full py-3 text-sm font-medium text-left transition-colors duration-100",
                    disabled
                        ? "opacity-50 cursor-not-allowed text-(--color-text-disabled)"
                        : "text-(--color-text-primary) hover:text-(--color-accent)",
                )}
            >
                <span>{title}</span>
                <ChevronDown
                    className={cn(
                        "w-4 h-4 shrink-0 text-(--color-icon-secondary) transition-transform duration-200",
                        isOpen && "rotate-180",
                    )}
                />
            </button>
            <div
                className={cn(
                    "grid transition-all duration-200 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                )}
            >
                <div className="overflow-hidden">
                    <div className="pb-3 text-sm text-(--color-text-secondary)">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export interface AccordionProps {
    children: React.ReactNode;
    className?: string;
}

export function Accordion({ children, className }: AccordionProps) {
    return (
        <div className={cn("divide-y divide-(--color-border) border-t border-(--color-border)", className)}>
            {children}
        </div>
    );
}
