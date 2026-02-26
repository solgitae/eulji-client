
import React, { useState, useRef, useEffect, useCallback, createContext, useContext } from "react";
import { cn } from "@/utils/util";

interface PopoverContextValue {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
}

const PopoverContext = createContext<PopoverContextValue>({
    isOpen: false,
    toggle: () => {},
    close: () => {},
});

export function Popover({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const toggle = useCallback(() => setIsOpen((v) => !v), []);
    const close = useCallback(() => setIsOpen(false), []);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
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

    return (
        <PopoverContext.Provider value={{ isOpen, toggle, close }}>
            <div ref={ref} className="relative inline-flex">
                {children}
            </div>
        </PopoverContext.Provider>
    );
}

export function PopoverTrigger({
    children,
    asChild,
    className,
}: {
    children: React.ReactNode;
    asChild?: boolean;
    className?: string;
}) {
    const { toggle } = useContext(PopoverContext);

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
            onClick: toggle,
        });
    }

    return (
        <button onClick={toggle} className={cn("cursor-pointer", className)}>
            {children}
        </button>
    );
}

export function PopoverContent({
    children,
    className,
    align = "start",
    side = "bottom",
}: {
    children: React.ReactNode;
    className?: string;
    align?: "start" | "center" | "end";
    side?: "top" | "bottom";
}) {
    const { isOpen } = useContext(PopoverContext);

    if (!isOpen) return null;

    const alignClass = {
        start: "left-0",
        center: "left-1/2 -translate-x-1/2",
        end: "right-0",
    };

    const sideClass = {
        top: "bottom-full mb-1",
        bottom: "top-full mt-1",
    };

    return (
        <div
            className={cn(
                "absolute z-50 min-w-[200px] rounded-xl p-3",
                "bg-(--color-bg-secondary) border border-(--color-border)",
                "shadow-(--shadow-elevated)",
                "animate-in fade-in slide-in-from-top-1 duration-150",
                alignClass[align],
                sideClass[side],
                className,
            )}
        >
            {children}
        </div>
    );
}
