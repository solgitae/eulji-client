import { useEffect } from "react";
import { create } from "zustand";
import type { BreadcrumbItem } from "@/components/ui/Breadcrumb";

interface BreadcrumbStore {
    items: BreadcrumbItem[];
    setItems: (items: BreadcrumbItem[]) => void;
}

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
    items: [],
    setItems: (items) => set({ items }),
}));

export const useSetBreadcrumbs = (items: BreadcrumbItem[]) => {
    const setItems = useBreadcrumbStore((state) => state.setItems);
    
    const itemsJson = JSON.stringify(items);
    
    useEffect(() => {
        setItems(items);
    }, [itemsJson, setItems]);
};
