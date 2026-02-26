
import React, { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/util";

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg";
}

const SIZES = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
};

export function Modal({
    open,
    onClose,
    children,
    className,
    size = "md",
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, onClose]);

    const handleOverlayClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === overlayRef.current) onClose();
        },
        [onClose],
    );

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    if (!open) return null;

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className={cn(
                "fixed inset-0 z-100 flex items-center justify-center",
                "bg-black/50",
                "animate-in fade-in duration-150",
            )}
        >
            <div
                role="dialog"
                aria-modal="true"
                className={cn(
                    "w-full mx-4 rounded-xl",
                    "bg-(--color-bg-secondary) border border-(--color-border)",
                    "shadow-(--shadow-elevated)",
                    "animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200",
                    SIZES[size],
                    className,
                )}
            >
                {children}
            </div>
        </div>
    );
}

export interface ModalHeaderProps {
    children: React.ReactNode;
    onClose?: () => void;
    className?: string;
}

export function ModalHeader({ children, onClose, className }: ModalHeaderProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-between px-5 pt-5 pb-0",
                className,
            )}
        >
            <h2 className="text-base font-semibold text-(--color-text-primary)">
                {children}
            </h2>
            {onClose && (
                <button
                    onClick={onClose}
                    className="p-1 rounded-md text-(--color-text-tertiary) hover:text-(--color-text-primary) hover:bg-(--color-bg-hover) transition-colors duration-100"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}

export interface ModalBodyProps {
    children: React.ReactNode;
    className?: string;
}

export function ModalBody({ children, className }: ModalBodyProps) {
    return (
        <div
            className={cn(
                "px-5 py-4 text-sm text-(--color-text-secondary) overflow-y-auto max-h-[60vh]",
                className,
            )}
        >
            {children}
        </div>
    );
}

export interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
    return (
        <div
            className={cn(
                "flex items-center justify-end gap-2 px-5 pb-5 pt-0",
                className,
            )}
        >
            {children}
        </div>
    );
}
