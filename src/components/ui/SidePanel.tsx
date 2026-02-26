
import React, { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/util";

function SidePanelOverlay({
    visible,
    onClick,
}: {
    visible: boolean;
    onClick: () => void;
}) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "fixed inset-0 z-40 transition-opacity duration-200",
                visible
                    ? "opacity-100 bg-black/20"
                    : "opacity-0 pointer-events-none",
            )}
        />
    );
}

export interface SidePanelProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
        width?: number;
        side?: "right" | "left";
        overlay?: boolean;
        closeOnEscape?: boolean;
    className?: string;
}

export function SidePanel({
    open,
    onClose,
    children,
    width = 380,
    side = "right",
    overlay = true,
    closeOnEscape = true,
    className,
}: SidePanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
        if (!open || !closeOnEscape) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, closeOnEscape, onClose]);

        useEffect(() => {
        if (open && overlay) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open, overlay]);

    const slideTransform = side === "right"
        ? open ? "translateX(0)" : `translateX(${width}px)`
        : open ? "translateX(0)" : `translateX(-${width}px)`;

    return (
        <>
            {overlay && <SidePanelOverlay visible={open} onClick={onClose} />}

            <aside
                ref={panelRef}
                style={{
                    width,
                    transform: slideTransform,
                    [side]: 0,
                }}
                className={cn(
                    "fixed top-0 h-full z-50 flex flex-col",
                    "bg-(--color-bg-primary)",
                    "border-(--color-border)",
                    side === "right" ? "border-l" : "border-r",
                    "shadow-(--shadow-elevated)",
                    "transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
                    className,
                )}
            >
                {children}
            </aside>
        </>
    );
}

export interface SidePanelHeaderProps {
    title: string;
    description?: string;
    onClose?: () => void;
        actions?: React.ReactNode;
    className?: string;
}

export function SidePanelHeader({
    title,
    description,
    onClose,
    actions,
    className,
}: SidePanelHeaderProps) {
    return (
        <header
            className={cn(
                "shrink-0 h-12 px-5 flex items-center justify-between gap-3",
                "border-b border-(--color-border)",
                className,
            )}
        >
            
            <div className="flex flex-col min-w-0">
                <h2 className="text-[16px] font-semibold text-(--color-text-primary) leading-tight truncate">
                    {title}
                </h2>
                {description && (
                    <p className="text-[11px] text-(--color-text-tertiary) leading-tight truncate mt-0.5">
                        {description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
                {actions}
                {onClose && (
                    <button
                        onClick={onClose}
                        className={cn(
                            "w-7 h-7 rounded-md flex items-center justify-center",
                            "text-(--color-text-tertiary) hover:text-(--color-text-primary)",
                            "hover:bg-(--color-bg-hover) transition-colors duration-100",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-focus)",
                        )}
                        aria-label="패널 닫기"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </header>
    );
}

export interface SidePanelBodyProps {
    children: React.ReactNode;
    className?: string;
}

export function SidePanelBody({ children, className }: SidePanelBodyProps) {
    return (
        <div
            className={cn(
                "flex-1 overflow-y-auto overscroll-contain",
                "p-5 flex flex-col gap-4",
                "bg-(--color-bg-primary)",
                className,
            )}
        >
            {children}
        </div>
    );
}

export interface SidePanelSectionProps {
    title?: string;
    actions?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
        flat?: boolean;
}

export function SidePanelSection({
    title,
    actions,
    children,
    className,
    flat = false,
}: SidePanelSectionProps) {
    return (
        <section
            className={cn(
                "flex flex-col gap-3",
                !flat && "rounded-lg border border-(--color-border) bg-(--color-bg-secondary) p-3",
                className,
            )}
        >
            {title && (
                <header className="flex items-center justify-between h-5">
                    <h3 className="text-[13px] font-semibold text-(--color-text-primary)">
                        {title}
                    </h3>
                    {actions && (
                        <div className="flex items-center gap-1">
                            {actions}
                        </div>
                    )}
                </header>
            )}
            {children}
        </section>
    );
}

export interface SidePanelRowProps {
    label: string;
    value: React.ReactNode;
    className?: string;
}

export function SidePanelRow({ label, value, className }: SidePanelRowProps) {
    return (
        <div className={cn("flex items-center justify-between gap-4", className)}>
            <span className="text-[13px] text-(--color-text-secondary) shrink-0">
                {label}
            </span>
            <span className="text-[13px] text-(--color-text-primary) font-medium text-right truncate">
                {value}
            </span>
        </div>
    );
}

export interface SidePanelStatProps {
    label: string;
    value: string | React.ReactNode;
    highlight?: boolean;
    className?: string;
}

export function SidePanelStat({ label, value, highlight, className }: SidePanelStatProps) {
    return (
        <div className={cn("flex flex-col gap-0.5", className)}>
            <span className="text-[11px] text-(--color-text-tertiary) uppercase tracking-wide">
                {label}
            </span>
            <span
                className={cn(
                    "text-[13px] font-medium tabular-nums",
                    highlight ? "text-(--color-accent)" : "text-(--color-text-primary)",
                )}
            >
                {value}
            </span>
        </div>
    );
}

export function SidePanelDivider({ className }: { className?: string }) {
    return <div className={cn("h-px bg-(--color-border) -mx-3", className)} />;
}

export interface SidePanelFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function SidePanelFooter({ children, className }: SidePanelFooterProps) {
    return (
        <footer
            className={cn(
                "shrink-0 h-[56px] px-5 flex items-center gap-3",
                "border-t border-(--color-border)",
                "bg-(--color-bg-primary)",
                className,
            )}
        >
            {children}
        </footer>
    );
}
