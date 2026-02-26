import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
    isOpen: boolean;
    width: number;
    isResizing: boolean;
    toggle: () => void;
    setOpen: (open: boolean) => void;
    setWidth: (width: number) => void;
    setIsResizing: (isResizing: boolean) => void;
}

export const useSidebar = create<SidebarState>()(
    persist(
        (set) => ({
            isOpen: true,
            width: 244,
            isResizing: false,
            toggle: () => set((state) => ({ isOpen: !state.isOpen })),
            setOpen: (open) => set({ isOpen: open }),
            setWidth: (width) => set({ width: Math.max(244, Math.min(480, width)) }),
            setIsResizing: (isResizing) => set({ isResizing }),
        }),
        {
            name: 'sidebar-state',
        }
    )
);
