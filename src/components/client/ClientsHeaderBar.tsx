
import React from "react";
import { Search, Filter, LayoutGrid, List } from "lucide-react";
import { cn } from "@/utils/util";
import Button from "@/components/ui/Button";

interface ClientsHeaderBarProps {
    searchQuery: string;
    onSearchChange: (val: string) => void;
    totalCount: number;
    activeColsCount: number;
    totalColsCount: number;
    onToggleColumns?: () => void;
}

export function ClientsHeaderBar({
    searchQuery,
    onSearchChange,
    totalCount,
    activeColsCount,
    totalColsCount,
    onToggleColumns
}: ClientsHeaderBarProps) {
    return (
        <div className="flex items-center justify-between py-2 px-1 border-b border-(--color-border) bg-(--color-bg-primary)">
            <div className="flex items-center gap-1">
                <button className="h-7 px-3 rounded-md bg-(--color-bg-tertiary) text-(--color-text-primary) text-[12px] font-bold">
                    All clients
                </button>
                <button className="h-7 px-3 rounded-md hover:bg-(--color-bg-hover) text-(--color-text-tertiary) text-[12px] font-bold transition-colors">
                    New view
                </button>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative group">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-(--color-text-disabled) group-focus-within:text-(--color-accent) transition-colors" />
                    <input
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="이름, 회사 검색..."
                        className="w-[200px] h-7 pl-8 pr-3 bg-(--color-bg-secondary) border border-(--color-border) rounded-md text-[12px] text-(--color-text-primary) placeholder:text-(--color-text-disabled) focus:outline-none focus:border-(--color-accent) transition-all"
                    />
                </div>
                
                <div className="h-4 w-px bg-(--color-border) mx-1" />

                <button className="flex items-center gap-1.5 h-7 px-2 hex-hover text-(--color-text-secondary) text-[12px] font-medium rounded-md hover:bg-(--color-bg-hover) transition-colors">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter</span>
                </button>
                
                <button 
                    onClick={onToggleColumns}
                    className="flex items-center gap-1.5 h-7 px-2 text-(--color-text-tertiary) text-[11px] font-medium rounded-md hover:bg-(--color-bg-hover) transition-colors"
                >
                    <span className="opacity-60">Columns</span>
                    <span className="text-(--color-text-secondary)">{activeColsCount}/{totalColsCount}</span>
                </button>
            </div>
        </div>
    );
}
