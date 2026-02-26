
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/utils/util";
import Button from "./Button";

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    showPageNumbers?: boolean;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className,
    showPageNumbers = true,
}: PaginationProps) {
    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const delta = 1; 

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - delta && i <= currentPage + delta)
            ) {
                pages.push(
                    <Button
                        key={i}
                        variant={i === currentPage ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                            "w-7 p-0 flex items-center justify-center font-mono",
                            i === currentPage
                                ? "bg-(--color-bg-active) text-(--color-text-primary) border-(--color-border-strong)"
                                : "text-(--color-text-tertiary)",
                        )}
                        onClick={() => onPageChange(i)}
                    >
                        {i}
                    </Button>,
                );
            } else if (
                i === currentPage - delta - 1 ||
                i === currentPage + delta + 1
            ) {
                pages.push(
                    <div
                        key={i}
                        className="w-7 h-7 flex items-center justify-center text-(--color-text-disabled)"
                    >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                    </div>,
                );
            }
        }
        return pages;
    };

    return (
        <nav
            role="navigation"
            aria-label="pagination"
            className={cn("flex items-center gap-1", className)}
        >
            <Button
                variant="ghost"
                size="sm"
                className="w-7 p-0 mr-1"
                disabled={currentPage <= 1}
                onClick={handlePrev}
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
            </Button>

            {showPageNumbers && (
                <div className="flex items-center gap-1">
                    {renderPageNumbers()}
                </div>
            )}

            <Button
                variant="ghost"
                size="sm"
                className="w-7 p-0 ml-1"
                disabled={currentPage >= totalPages}
                onClick={handleNext}
                aria-label="Next page"
            >
                <ChevronRight className="w-4 h-4" />
            </Button>
        </nav>
    );
}

export default Pagination;
