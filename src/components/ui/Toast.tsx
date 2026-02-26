import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
    id: string;
    message: string;
    description?: string;
    type?: ToastType;
    duration?: number;
    isDismissing?: boolean;
}

interface ToastStore {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id" | "isDismissing">) => void;
    dismissToast: (id: string) => void;
    removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }],
        }));

        if (toast.duration !== 0) {
            setTimeout(() => {
                get().dismissToast(id);
            }, toast.duration || 3000);
        }
    },
    dismissToast: (id) => {
        set((state) => ({
            toasts: state.toasts.map((t) =>
                t.id === id ? { ...t, isDismissing: true } : t
            ),
        }));
        // Wait for CSS transition (400ms) before actual remove
        setTimeout(() => {
            get().removeToast(id);
        }, 400); 
    },
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
}));

export const useToast = () => {
    const addToast = useToastStore((state) => state.addToast);

    return {
        toast: (message: string, options?: Omit<Toast, "id" | "message">) =>
            addToast({ message, ...options }),
        success: (message: string, options?: Omit<Toast, "id" | "message" | "type">) =>
            addToast({ message, type: "success", ...options }),
        error: (message: string, options?: Omit<Toast, "id" | "message" | "type">) =>
            addToast({ message, type: "error", ...options }),
        info: (message: string, options?: Omit<Toast, "id" | "message" | "type">) =>
            addToast({ message, type: "info", ...options }),
        warning: (message: string, options?: Omit<Toast, "id" | "message" | "type">) =>
            addToast({ message, type: "warning", ...options }),
    };
};
