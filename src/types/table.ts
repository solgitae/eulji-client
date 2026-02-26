import type { ReactNode } from "react";

export type Align = "start" | "center" | "end";
export type SortDirection = "asc" | "desc" | null;

export interface ColumnDef<T> {
    id: string;
    label?: string; 
    width?: string; 
    minWidth?: number; 
    headerAlign?: Align;
    cellAlign?: Align;
    pinned?: "left" | "right"; 
    sortable?: boolean; 
    interactive?: boolean; 
    className?: string; 
    render: (item: T) => ReactNode;
}
