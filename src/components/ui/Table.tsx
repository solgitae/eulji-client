
import React, {
    useState,
    useRef,
    useCallback,
    useMemo,
    useEffect,
    createContext,
    useContext,
} from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, Minus, Copy, CheckSquare, Square } from "lucide-react";
import { cn } from "@/utils/util";
import type { ColumnDef, SortDirection } from "@/types/table";
import Checkbox from "./Checkbox";
import { Skeleton } from "./Skeleton";
import { DelayedRender } from "./DelayedRender";
import { EmptyState } from "./EmptyState";
import { useDelayedLoading } from "@/hooks/useDelayedLoading";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSep,
} from "./ContextMenu";

/* ═════════════════════════════════════════════
   Table · Linear-style
   ═════════════════════════════════════════════
   Production-grade data table component.

   Features:
   ① Column resize (drag header edge)
   ② Sort (click header: asc → desc → none)
   ③ Row selection (checkbox, Select All)
   ④ Keyboard navigation (↑↓ rows, Enter)
   ⑤ Empty state (auto EmptyState)
   ⑥ Loading state (auto Skeleton rows)
   ⑦ Sticky header

   Design rules (linear-rules.md):
   - LCH semantic tokens only
   - Row height 40px (8pt grid)
   - Horizontal borders only, no vertical
   - Hover = brightness change, not color
   - Selection = faint accent background
   ═════════════════════════════════════════════ */

/* ── Types ── */
interface SortState {
    columnId: string;
    direction: SortDirection;
}

interface TableContextValue {
    selectedRows: Set<string>;
    toggleRow: (id: string) => void;
    toggleAll: () => void;
    allSelected: boolean;
    someSelected: boolean;
    selectable: boolean;
    activeRowIndex: number;
    setActiveRowIndex: (i: number) => void;
    onRowClick?: (id: string) => void;
}

const TableContext = createContext<TableContextValue>({
    selectedRows: new Set(),
    toggleRow: () => {},
    toggleAll: () => {},
    allSelected: false,
    someSelected: false,
    selectable: false,
    activeRowIndex: -1,
    setActiveRowIndex: () => {},
});

/* ── Sort Icon ── */
function SortIcon({ direction }: { direction: SortDirection }) {
    if (direction === "asc") return <ArrowUp className="w-3 h-3" />;
    if (direction === "desc") return <ArrowDown className="w-3 h-3" />;
    return <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/th:opacity-50" />;
}

/* ════════════════════════════════════════════
   Main Table Component
   ════════════════════════════════════════════ */
export interface TableProps<T extends { id: string }> {
    columns: ColumnDef<T>[];
    data: T[];
    /** Enable row selection checkboxes */
    selectable?: boolean;
    /** Controlled selected row IDs */
    selectedIds?: string[];
    /** Selection change callback */
    onSelectionChange?: (ids: string[]) => void;
    /** Row click handler */
    onRowClick?: (id: string) => void;
    /** Loading state — shows skeleton rows */
    loading?: boolean;
    /** Number of skeleton rows to show */
    loadingRows?: number;
    /** Custom empty state content */
    emptyTitle?: string;
    emptyDescription?: string;
    emptyAction?: React.ReactNode;
    /** Custom empty icon */
    emptyIcon?: React.ReactNode;
    /** Class for the table container */
    className?: string;
    /** Custom context menu per row */
    renderContextMenu?: (item: T) => React.ReactNode;
    /** Whether the table is in selection mode */
    selectionMode?: boolean;
}

export function Table<T extends { id: string }>({
    columns,
    data,
    selectable = false,
    selectedIds,
    onSelectionChange,
    onRowClick,
    loading = false,
    loadingRows = 5,
    emptyTitle = "데이터가 없습니다",
    emptyDescription,
    emptyAction,
    emptyIcon,
    className,
    renderContextMenu,
    selectionMode = false,
}: TableProps<T>) {
    /* ── Selection state ── */
    const [internalSelected, setInternalSelected] = useState<Set<string>>(new Set());
    const selectedRows = selectedIds ? new Set(selectedIds) : internalSelected;

    const setSelectedRows = useCallback(
        (next: Set<string>) => {
            if (onSelectionChange) {
                onSelectionChange(Array.from(next));
            } else {
                setInternalSelected(next);
            }
        },
        [onSelectionChange],
    );

    const toggleRow = useCallback(
        (id: string) => {
            const next = new Set(selectedRows);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            setSelectedRows(next);
        },
        [selectedRows, setSelectedRows],
    );

    const toggleAll = useCallback(() => {
        if (selectedRows.size === data.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(data.map((d) => d.id)));
        }
    }, [data, selectedRows, setSelectedRows]);

    const allSelected = data.length > 0 && selectedRows.size === data.length;
    const someSelected = selectedRows.size > 0 && !allSelected;

    // Selection UI visibility guard
    const isSelectionUIActive = selectable;

    /* ── Sort state ── */
    const [sort, setSort] = useState<SortState>({ columnId: "", direction: null });

    const handleSort = useCallback((columnId: string) => {
        setSort((prev) => {
            if (prev.columnId !== columnId) return { columnId, direction: "asc" };
            if (prev.direction === "asc") return { columnId, direction: "desc" };
            if (prev.direction === "desc") return { columnId: "", direction: null };
            return { columnId, direction: "asc" };
        });
    }, []);

    /* ── Column widths (Removed resize logic) ── */
    const [columnWidths] = useState<Record<string, number>>({});

    /* ── Drag Selection ── */
    const [dragStartIdx, setDragStartIdx] = useState<number | null>(null);
    const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
    const [dragMode, setDragMode] = useState<"select" | "deselect">("select");

    const selectRange = useCallback(
        (start: number, end: number, mode: "select" | "deselect") => {
            if (!isSelectionUIActive) return;
            const min = Math.min(start, end);
            const max = Math.max(start, end);
            const newSelected = new Set(selectedRows);

            for (let i = min; i <= max; i++) {
                const id = data[i].id;
                if (mode === "select") {
                    newSelected.add(id);
                } else {
                    newSelected.delete(id);
                }
            }
            setSelectedRows(newSelected);
        },
        [data, selectedRows, setSelectedRows, isSelectionUIActive],
    );

    const handleMouseDown = (e: React.MouseEvent, index: number) => {
        if (!isSelectionUIActive || e.button !== 0) return;

        // Skip if clicking on interactive elements
        const target = e.target as HTMLElement;
        const interactiveSelector =
            'button, a, input, select, textarea, [role="menu"], [role="menuitem"], [role="listbox"], [role="option"], [role="combobox"], [data-interactive]';
        if (target.closest(interactiveSelector)) return;

        setDragStartIdx(index);
        setDraggingIdx(index);
        const id = data[index].id;
        const isAlreadySelected = selectedRows.has(id);
        const mode = isAlreadySelected ? "deselect" : "select";
        setDragMode(mode);
    };

    const handleMouseEnter = (index: number) => {
        if (dragStartIdx !== null) {
            setDraggingIdx(index);
            selectRange(dragStartIdx, index, dragMode);
        }
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setDragStartIdx(null);
            setDraggingIdx(null);
        };
        window.addEventListener("mouseup", handleGlobalMouseUp);
        return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
    }, []);

    // Delay the visual loading state by 150ms to prevent skeleton flash
    // If skeleton IS shown, ensure it stays for at least 500ms to prevent jitter
    const delayedLoading = useDelayedLoading(loading || false, { delayMs: 150, minDisplayMs: 500 });


    /* ── Keyboard navigation ── */
    const [activeRowIndex, setActiveRowIndex] = useState(-1);
    const tableRef = useRef<HTMLTableElement>(null);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (data.length === 0) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveRowIndex((i) => Math.min(i + 1, data.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveRowIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && activeRowIndex >= 0) {
                e.preventDefault();
                const item = data[activeRowIndex];
                if (item) {
                    if (selectionMode) {
                        toggleRow(item.id);
                    } else {
                        onRowClick?.(item.id);
                    }
                }
            } else if (e.key === " " && selectable && activeRowIndex >= 0) {
                e.preventDefault();
                const item = data[activeRowIndex];
                if (item) toggleRow(item.id);
            }
        },
        [data, activeRowIndex, onRowClick, selectable, toggleRow, selectionMode],
    );

    /* ── Scroll active row into view ── */
    useEffect(() => {
        if (activeRowIndex < 0 || !tableRef.current) return;
        const row = tableRef.current.querySelector(`[data-row-index="${activeRowIndex}"]`);
        row?.scrollIntoView({ block: "nearest" });
    }, [activeRowIndex]);

    /* ── Context ── */
    const ctx = useMemo<TableContextValue>(
        () => ({
            selectedRows,
            toggleRow,
            toggleAll,
            allSelected,
            someSelected,
            selectable: isSelectionUIActive,
            activeRowIndex,
            setActiveRowIndex,
            onRowClick,
        }),
        [selectedRows, toggleRow, toggleAll, allSelected, someSelected, isSelectionUIActive, activeRowIndex, onRowClick],
    );

    /* ── Align helper ── */
    const alignClass = (align?: string) => {
        if (align === "center") return "text-center justify-center";
        if (align === "end") return "text-right justify-end";
        return "text-left justify-start";
    };

    /* ── Pin helpers ── */
    const pinnedLeftCols = columns.filter((c) => c.pinned === "left");
    const pinnedRightCols = columns.filter((c) => c.pinned === "right");

    const getPinStyle = (col: ColumnDef<T>): React.CSSProperties | undefined => {
        if (!col.pinned) return undefined;

        if (col.pinned === "left") {
            // Calculate left offset: sum of widths of preceding pinned-left cols + selector col
            let offset = isSelectionUIActive ? 40 : 0;
            for (const c of pinnedLeftCols) {
                if (c.id === col.id) break;
                offset += columnWidths[c.id] || 120;
            }
            return { position: "sticky", left: offset, zIndex: 5 };
        }

        if (col.pinned === "right") {
            // Calculate right offset: sum of widths of following pinned-right cols
            let offset = 0;
            const reversedRight = [...pinnedRightCols].reverse();
            for (const c of reversedRight) {
                if (c.id === col.id) break;
                offset += columnWidths[c.id] || 120;
            }
            return { position: "sticky", right: offset, zIndex: 5 };
        }
    };

    const pinClass = (col: ColumnDef<T>) => {
        if (!col.pinned) return "";
        return "transition-[left,right] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";
    };

    const pinRowClass = (col: ColumnDef<T>, isSelected: boolean, isActive: boolean) => {
        if (!col.pinned) return "";
        return cn(
            isSelected
                ? "bg-(--color-row-selected)"
                : isActive
                  ? "bg-(--color-bg-tertiary)"
                  : "bg-(--color-bg-secondary) group-hover/row:bg-(--color-bg-tertiary)",
        );
    };

    /* ── Render ── */
    return (
        <TableContext.Provider value={ctx}>
            <div
                className={cn(
                    "w-full overflow-y-auto overflow-x-scroll relative scrollbar-thin",
                    className,
                )}
            >
                <table
                    ref={tableRef}
                    tabIndex={0}
                    onKeyDown={handleKeyDown}
                    className="w-full min-w-max border-separate border-spacing-0 focus:outline-none"
                >
                    {/* ── Header ── */}
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-(--color-bg-secondary)">
                            <th
                                className={cn(
                                    "h-[36px] border-b border-(--color-border) bg-(--color-bg-secondary) p-0 transition-[width,min-width,max-width,opacity,padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                    isSelectionUIActive ? "w-[40px] min-w-[40px] max-w-[40px] opacity-100" : "w-0 min-w-0 max-w-0 opacity-0 overflow-hidden pointer-events-none"
                                )}
                                style={{ position: "sticky", left: 0, zIndex: 6 }}
                            >
                                <div className={cn(
                                    "flex items-center justify-center overflow-hidden transition-[width,padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] h-[36px]",
                                    isSelectionUIActive ? "px-3 w-[40px]" : "px-0 w-0"
                                )}>
                                    <Checkbox
                                        checked={allSelected}
                                        onChange={toggleAll}
                                        className={someSelected ? "opacity-60" : ""}
                                    />
                                </div>
                            </th>
                            {columns.map((col) => {
                                const isSorted = sort.columnId === col.id;
                                const width = columnWidths[col.id];

                                return (
                                    <th
                                        key={col.id}
                                        className={cn(
                                            "relative h-[36px] px-4 border-b border-(--color-border)",
                                            "text-left select-none group/th whitespace-nowrap overflow-hidden",
                                            col.width && !width && col.width,
                                            col.pinned && "bg-(--color-bg-secondary)",
                                            pinClass(col),
                                        )}
                                        style={{
                                            ...getPinStyle(col),
                                            ...(col.width && !width ? { maxWidth: col.width.includes('[') ? col.width.split('[')[1].split(']')[0] : (col.width.startsWith('w-') ? `${parseInt(col.width.split('-')[1]) * 4}px` : undefined) } : {}),
                                        }}
                                    >
                                        {col.label && (
                                            <div className={cn(
                                                "relative flex items-center w-full h-full",
                                                alignClass(col.headerAlign)
                                            )}>
                                                    <button
                                                        onClick={() => col.sortable && handleSort(col.id)}
                                                        className={cn(
                                                            "relative flex items-center whitespace-nowrap outline-none w-full",
                                                            col.sortable ? "pr-5" : "",
                                                            alignClass(col.headerAlign),
                                                            "text-[11px] font-semibold tracking-wider uppercase",
                                                            col.sortable && "cursor-pointer hover:text-(--color-text-secondary)",
                                                            isSorted ? "text-(--color-text-secondary)" : "text-(--color-text-tertiary)"
                                                        )}
                                                    >
                                                        <span>{col.label}</span>
                                                        {col.sortable && (
                                                            <span className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                                                                <SortIcon direction={isSorted ? sort.direction : null} />
                                                            </span>
                                                        )}
                                                    </button>
                                            </div>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {/* Loading state */}
                        {delayedLoading &&
                            Array.from({ length: loadingRows }, (_, i) => (
                                <tr 
                                    key={`skeleton-${i}`} 
                                    className="animate-in fade-in duration-500 group/row"
                                >
                                    <td className={cn(
                                        "h-[45px] py-3 p-0 border-b border-(--color-border) transition-[width,min-width,max-width,opacity,padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                        isSelectionUIActive ? "w-[40px] min-w-[40px] max-w-[40px] opacity-100" : "w-0 min-w-0 max-w-0 opacity-0 overflow-hidden pointer-events-none"
                                    )}>
                                        <div className={cn(
                                            "flex items-center justify-center overflow-hidden transition-[width,padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] h-full",
                                            isSelectionUIActive ? "px-3 w-[40px]" : "px-0 w-0"
                                        )}>
                                            <Skeleton variant="rect" width={16} height={16} />
                                        </div>
                                    </td>
                                    {columns.map((col) => (
                                        <td
                                            key={col.id}
                                            className={cn("px-4 py-3 h-[45px] border-b border-(--color-border) ", col.width, col.cellAlign === "center" ? "text-center" : col.cellAlign === "end" ? "text-right" : "text-left")}
                                        >
                                            <div className={cn("flex items-center w-full h-full", 
                                                col.cellAlign === "center" ? "justify-center" : col.cellAlign === "end" ? "justify-end" : "justify-start"
                                            )}>
                                                <Skeleton variant="text" className={cn("w-3/4 max-w-[120px]", col.cellAlign === "center" ? "mx-auto" : col.cellAlign === "end" ? "ml-auto" : "")} />
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}

                        {/* Empty state */}
                        {!delayedLoading && !loading && data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="h-[200px]"
                                >
                                    <EmptyState
                                        icon={emptyIcon}
                                        title={emptyTitle}
                                        description={emptyDescription}
                                        action={emptyAction}
                                    />
                                </td>
                            </tr>
                        )}

                        {/* Data rows */}
                        {!delayedLoading &&
                            data.map((item, rowIndex) => {
                                const isSelected = selectedRows.has(item.id);
                                const isActive = rowIndex === activeRowIndex;

                                const DefaultMenu = (
                                    <>
                                        <ContextMenuItem
                                            icon={Copy}
                                            onClick={() => {
                                                navigator.clipboard.writeText(item.id);
                                            }}
                                        >
                                            아이디 복사
                                        </ContextMenuItem>
                                        <ContextMenuSep />
                                        <ContextMenuItem
                                            icon={isSelected ? Square : CheckSquare}
                                            onClick={() => toggleRow(item.id)}
                                        >
                                            {isSelected ? "선택 해제" : "선택"}
                                        </ContextMenuItem>
                                    </>
                                );

                                return (
                                    <ContextMenu key={item.id}>
                                        <ContextMenuTrigger
                                            as="tr"
                                            data-row-index={rowIndex}
                                            onClick={(e) => {
                                                const target = e.target as HTMLElement;
                                                const interactiveSelector =
                                                    'button, a, input, select, textarea, [role="menu"], [role="menuitem"], [role="listbox"], [role="option"], [role="combobox"], [data-interactive]';
                                                if (target.closest(interactiveSelector)) return;

                                                setActiveRowIndex(rowIndex);

                                                if (selectionMode) {
                                                    toggleRow(item.id);
                                                } else {
                                                    onRowClick?.(item.id);
                                                }
                                            }}
                                            onMouseDown={(e) => handleMouseDown(e, rowIndex)}
                                            onMouseEnter={() => handleMouseEnter(rowIndex)}
                                            className={cn(
                                                "group/row",
                                                dragStartIdx !== null && "select-none",
                                                isSelected
                                                    ? "bg-(--color-row-selected)"
                                                    : "bg-(--color-bg-secondary) hover:bg-(--color-bg-tertiary)",
                                            )}
                                        >
                                            <td
                                                className={cn(
                                                    "h-[40px] p-0 border-b border-(--color-border) transition-[width,min-width,max-width,opacity,padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                                    isSelected
                                                        ? "bg-(--color-row-selected)"
                                                        : "bg-(--color-bg-secondary) group-hover/row:bg-(--color-bg-tertiary)",
                                                    isSelectionUIActive ? "w-[40px] min-w-[40px] max-w-[40px] opacity-100" : "w-0 min-w-0 max-w-0 opacity-0 overflow-hidden pointer-events-none"
                                                )}
                                                style={{ position: "sticky", left: 0, zIndex: 5 }}
                                                onClick={(e) => e.stopPropagation()}
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                <div className={cn(
                                                    "flex items-center justify-center overflow-hidden transition-[width,padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] h-[40px]",
                                                    isSelectionUIActive ? "px-3 w-[40px]" : "px-0 w-0"
                                                )}>
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={() => toggleRow(item.id)}
                                                    />
                                                </div>
                                            </td>
                                            {columns.map((col) => {
                                                const width = columnWidths[col.id];
                                                return (
                                                    <td
                                                        key={col.id}
                                                        style={{
                                                            ...(width ? { width, minWidth: width, maxWidth: width } : {}),
                                                            ...(!width && col.width ? { maxWidth: col.width.includes('[') ? col.width.split('[')[1].split(']')[0] : (col.width.startsWith('w-') ? `${parseInt(col.width.split('-')[1]) * 4}px` : undefined) } : {}),
                                                            ...getPinStyle(col),
                                                        }}
                                                        onClick={col.interactive ? (e) => e.stopPropagation() : undefined}
                                                        className={cn(
                                                            "px-4 h-[40px] text-[13px] text-(--color-text-secondary) whitespace-nowrap border-b border-(--color-border) overflow-hidden",
                                                            !width && col.width,
                                                            col.className,
                                                            pinClass(col),
                                                            pinRowClass(col, isSelected, isActive),
                                                        )}
                                                    >
                                                        <div
                                                            className={cn(
                                                                "flex items-center w-full h-full",
                                                                alignClass(col.cellAlign),
                                                            )}
                                                        >
                                                            {col.render(item)}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            {renderContextMenu ? renderContextMenu(item) : DefaultMenu}
                                        </ContextMenuContent>
                                    </ContextMenu>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </TableContext.Provider>
    );
}
