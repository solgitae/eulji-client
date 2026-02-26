
import React from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/utils/util";
import { useToastStore, ToastType } from "./Toast";

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="w-4 h-4 text-(--color-status-done)" />,
    error: <AlertCircle className="w-4 h-4 text-(--color-feedback-error)" />,
    info: <Info className="w-4 h-4 text-(--color-feedback-info)" />,
    warning: <AlertTriangle className="w-4 h-4 text-(--color-feedback-warning)" />,
};

export function Toaster() {
    const { toasts, dismissToast } = useToastStore();

    return (
        <div className="fixed bottom-6 right-6 z-200 flex flex-col pointer-events-none w-[360px] max-w-[calc(100vw-48px)] h-[120px]">
            {[...toasts].reverse().map((toast, index) => {
                if (index > 3) return null; // Limit displayed toasts

                return (
                    <div
                        key={toast.id}
                        className={cn(
                            "absolute bottom-0 right-0 w-full",
                            "pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-(--shadow-elevated)",
                            "bg-(--color-bg-secondary) border border-(--color-border)",
                            "transition-all duration-400 ease-out",
                            toast.isDismissing 
                                ? "opacity-0 scale-95 translate-y-4" 
                                : "animate-in slide-in-from-bottom-8 fade-in zoom-in-95"
                        )}
                        style={{
                            transform: toast.isDismissing
                                ? undefined
                                : `translateY(-${index * 16}px) scale(${1 - index * 0.05})`,
                            zIndex: 100 - index,
                            opacity: toast.isDismissing ? 0 : 1 - index * 0.15,
                        }}
                    >
                    <div className="shrink-0 mt-0.5">
                        {toast.type ? TOAST_ICONS[toast.type] : TOAST_ICONS.info}
                    </div>
                    
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-(--color-text-primary)">
                            {toast.message}
                        </p>
                        {toast.description && (
                            <p className="text-xs text-(--color-text-tertiary) mt-1 leading-relaxed">
                                {toast.description}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => dismissToast(toast.id)}
                        className="shrink-0 p-1 rounded-md hover:bg-(--color-bg-hover) text-(--color-text-tertiary) transition-colors mt-0.5"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
                );
            })}
        </div>
    );
}
