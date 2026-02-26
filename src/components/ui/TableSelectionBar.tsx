
import React from "react";
import { X, Trash2 } from "lucide-react";
import Button from "./Button";
import { cn } from "@/utils/util";

interface TableSelectionBarProps {
    selectedCount: number;
    onDeselect: () => void;
    onDelete: () => void;
    isVisible: boolean;
}

export function TableSelectionBar({
    selectedCount,
    onDeselect,
    onDelete,
    isVisible,
}: TableSelectionBarProps) {
    if (!isVisible && selectedCount === 0) return null;

    return (
        <div 
            className={cn(
                "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out flex items-center gap-4 px-4 py-2.5 rounded-full",
                "bg-(--color-bg-inverse)/85 backdrop-blur-md text-(--color-text-inverse) shadow-elevated border border-white/10 dark:border-black/10",
                isVisible && selectedCount > 0
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0 pointer-events-none"
            )}
        >
            <div className="flex items-center gap-3 px-1">
                <span className="text-[13px] font-medium">
                    {selectedCount}개 선택됨
                </span>
                <div className="w-px h-3.5 bg-current opacity-20" />
            </div>

            <div className="flex items-center gap-1.5">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDeselect}
                    icon={<X className="w-3.5 h-3.5" />}
                    className="h-8 text-[12px] text-inherit opacity-70 hover:opacity-100 hover:bg-(--color-bg-inverse-hover) px-3 rounded-full"
                >
                    선택 해제
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    className="h-8 text-[12px] text-red-500 hover:bg-red-500/10 px-3 rounded-full"
                >
                    삭제
                </Button>
            </div>
        </div>
    );
}

export default TableSelectionBar;
