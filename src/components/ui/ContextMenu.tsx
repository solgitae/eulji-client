
import React, { useState, useRef, useEffect, useCallback, createContext, useContext, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/util";

interface ContextMenuState {
    isOpen: boolean;
    x: number;
    y: number;
    open: (x: number, y: number) => void;
    close: () => void;
}

const ContextMenuContext = createContext<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    open: () => {},
    close: () => {},
});

export function ContextMenu({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState({ isOpen: false, x: 0, y: 0 });

    const open = useCallback((x: number, y: number) => {
        window.dispatchEvent(new CustomEvent("context-menu-open"));
        setState({ isOpen: true, x, y });
    }, []);

    const close = useCallback(() => {
        setState({ isOpen: false, x: 0, y: 0 });
    }, []);

    useEffect(() => {
        if (!state.isOpen) return;
        const handler = () => close();

        const timeout = setTimeout(() => {
            document.addEventListener("click", handler);
            document.addEventListener("contextmenu", handler);
        }, 0);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener("click", handler);
            document.removeEventListener("contextmenu", handler);
        };
    }, [state.isOpen, close]);

    useEffect(() => {
        const handler = () => {
            if (state.isOpen) close();
        };
        window.addEventListener("context-menu-open", handler);
        return () => window.removeEventListener("context-menu-open", handler);
    }, [state.isOpen, close]);

    useEffect(() => {
        if (!state.isOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [state.isOpen, close]);

    useEffect(() => {
        if (!state.isOpen) return;
        const handler = () => close();
        window.addEventListener("scroll", handler, true);
        return () => window.removeEventListener("scroll", handler, true);
    }, [state.isOpen, close]);

    return (
        <ContextMenuContext.Provider value={{ ...state, open, close }}>
            {children}
        </ContextMenuContext.Provider>
    );
}

export function ContextMenuTrigger<T extends React.ElementType = "div">({
    children,
    className,
    as,
    ...props
}: {
    children: React.ReactNode;
    className?: string;
    as?: T;
} & React.ComponentPropsWithoutRef<T>) {
    const { open } = useContext(ContextMenuContext);
    const Component = as || "div";

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        open(e.clientX, e.clientY);
    };

    return (
        <Component
            onContextMenu={handleContextMenu}
            className={className}
            {...(props as any)}
        >
            {children}
        </Component>
    );
}
ContextMenuTrigger.displayName = "ContextMenuTrigger";

export function ContextMenuContent({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { isOpen, x, y } = useContext(ContextMenuContext);
    const menuRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState({ x, y });
    const [isPositioned, setIsPositioned] = useState(false);

    useLayoutEffect(() => {
        if (!isOpen || !menuRef.current) {
            setIsPositioned(false);
            return;
        }

        const rect = menuRef.current.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const nextX = x + rect.width > vw ? vw - rect.width - 8 : x;
        const nextY = y + rect.height > vh ? vh - rect.height - 8 : y;

        setPos({ x: nextX, y: nextY });
        setIsPositioned(true);
    }, [isOpen, x, y]);

    if (!isOpen) return null;

    const originX = pos.x < x ? "right" : "left";
    const originY = pos.y < y ? "bottom" : "top";

    return createPortal(
        <div
            ref={menuRef}
            className={cn(
                "fixed z-9999 min-w-[180px] rounded-lg p-1",
                "bg-(--color-bg-secondary) border border-(--color-border)",
                "shadow-(--shadow-elevated) transition-opacity duration-0",
                isPositioned 
                    ? "animate-in fade-in zoom-in-95 duration-100 opacity-100" 
                    : "opacity-0",
                className,
            )}
            style={{ 
                left: pos.x, 
                top: pos.y,
                transformOrigin: `${originY} ${originX}`
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>,
        document.body,
    );
}

export function ContextMenuItem({
    children,
    onClick,
    icon: Icon,
    shortcut,
    destructive = false,
    disabled = false,
    className,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    icon?: React.ComponentType<{ className?: string }>;
    shortcut?: string[];
    destructive?: boolean;
    disabled?: boolean;
    className?: string;
}) {
    const { close } = useContext(ContextMenuContext);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (disabled) return;
        onClick?.();
        close();
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                "flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md transition-colors duration-75",
                disabled
                    ? "opacity-50 cursor-not-allowed"
                    : destructive
                      ? "text-(--color-danger) hover:bg-(--color-danger-bg)"
                      : "text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-bg-hover)",
                className,
            )}
        >
            {Icon && <Icon className="w-4 h-4 shrink-0" />}
            <span className="flex-1 text-left truncate">{children}</span>
            {shortcut && (
                <span className="flex gap-0.5 ml-auto text-xs text-(--color-text-disabled)">
                    {shortcut.join("")}
                </span>
            )}
        </button>
    );
}

export function ContextMenuSep({ className }: { className?: string }) {
    return <div className={cn("h-px bg-(--color-border) my-1 -mx-1", className)} />;
}
