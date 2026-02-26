
import { ReactNode, useEffect } from "react";
import { cn } from "@/utils/util";
import { X } from "lucide-react";

interface LinearModalProps {
    open: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    children: ReactNode;
    primaryActionLabel?: string;
    onPrimaryAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
    className?: string;
}

export function LinearModal({
    open,
    title,
    description,
    onClose,
    children,
    primaryActionLabel = "Save",
    onPrimaryAction,
    secondaryActionLabel,
    onSecondaryAction,
    className,
}: LinearModalProps) {
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/45 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className={cn(
                    "w-full max-w-md rounded-xl bg-(--color-bg-secondary) text-(--color-text-primary) shadow-(--shadow-elevated) border border-(--color-border) px-6 py-5",
                    "animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200",
                    className
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h2 className="text-[16px] font-bold leading-tight tracking-tight">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-[13px] text-(--color-text-tertiary)">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-(--color-icon-secondary) hover:bg-(--color-bg-hover) hover:text-(--color-text-primary) transition-colors duration-150"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body (form fields) */}
                <div className="space-y-4">{children}</div>

                {/* Footer */}
                <div className="mt-6 flex justify-end gap-2">
                    {secondaryActionLabel && (
                        <button
                            type="button"
                            onClick={onSecondaryAction ?? onClose}
                            className="inline-flex items-center justify-center rounded-md border border-(--color-border) bg-(--color-bg-secondary) px-3 py-1.5 text-[13px] font-medium text-(--color-text-secondary) hover:bg-(--color-bg-hover) transition-colors duration-150"
                        >
                            {secondaryActionLabel}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onPrimaryAction}
                        className="inline-flex items-center justify-center rounded-md bg-(--color-accent) px-3.5 py-1.5 text-[13px] font-bold text-(--color-text-on-accent) hover:bg-(--color-accent-hover) transition-colors duration-150"
                    >
                        {primaryActionLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
