
import React, { useEffect, useRef, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/utils/util";

export interface AlertDialogProps {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning" | "default";
    className?: string;
}

export function AlertDialog({
    open,
    onConfirm,
    onCancel,
    title,
    description,
    confirmLabel = "확인",
    cancelLabel = "취소",
    variant = "default",
    className,
}: AlertDialogProps) {
    const confirmRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onCancel();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onCancel]);

    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => confirmRef.current?.focus());
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    if (!open) return null;

    const variantStyles = {
        danger: {
            icon: "text-(--color-danger)",
            iconBg: "bg-(--color-danger-bg)",
            confirm: "bg-(--color-danger) text-white hover:opacity-90",
        },
        warning: {
            icon: "text-(--color-status-pending)",
            iconBg: "bg-(--color-status-pending-bg)",
            confirm: "bg-(--color-status-pending) text-white hover:opacity-90",
        },
        default: {
            icon: "text-(--color-accent)",
            iconBg: "bg-(--color-accent)/10",
            confirm: "bg-(--color-accent) text-(--color-text-on-accent) hover:bg-(--color-accent-hover)",
        },
    };

    const styles = variantStyles[variant];

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 animate-in fade-in duration-100"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="alert-title"
            aria-describedby={description ? "alert-desc" : undefined}
        >
            <div
                className={cn(
                    "w-full max-w-sm mx-4 rounded-xl p-6",
                    "bg-(--color-bg-secondary) border border-(--color-border)",
                    "shadow-(--shadow-elevated)",
                    "animate-in fade-in zoom-in-95 duration-150",
                    className,
                )}
            >
                
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-4", styles.iconBg)}>
                    <AlertTriangle className={cn("w-5 h-5", styles.icon)} />
                </div>

                <h2
                    id="alert-title"
                    className="text-base font-semibold text-(--color-text-primary) mb-1"
                >
                    {title}
                </h2>
                {description && (
                    <p
                        id="alert-desc"
                        className="text-sm text-(--color-text-secondary) mb-5"
                    >
                        {description}
                    </p>
                )}

                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className={cn(
                            "h-8 px-3 rounded-md text-sm font-medium transition-colors duration-100",
                            "text-(--color-text-secondary) hover:text-(--color-text-primary)",
                            "hover:bg-(--color-bg-hover)",
                        )}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmRef}
                        onClick={onConfirm}
                        className={cn(
                            "h-8 px-3 rounded-md text-sm font-medium transition-colors duration-100",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-border-focus) focus-visible:ring-offset-1",
                            styles.confirm,
                        )}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
