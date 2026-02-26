
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, ArrowRight, Hash, Settings, Users, FileText, Plus } from "lucide-react";
import { cn } from "@/utils/util";
import { Kbd } from "./Kbd";

export interface CommandItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    shortcut?: string[];
    group?: string;
    onSelect: () => void;
}

export interface CommandBarProps {
    items: CommandItem[];
    placeholder?: string;
}

export function CommandBar({ items, placeholder = "검색하거나 명령을 입력하세요..." }: CommandBarProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((v) => !v);
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    useEffect(() => {
        if (open) {
            setQuery("");
            setActiveIndex(0);
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const filtered = useMemo(() => {
        if (!query.trim()) return items;
        const q = query.toLowerCase();
        return items.filter((item) =>
            item.label.toLowerCase().includes(q) ||
            item.group?.toLowerCase().includes(q)
        );
    }, [items, query]);

    const grouped = useMemo(() => {
        const groups: Record<string, CommandItem[]> = {};
        filtered.forEach((item) => {
            const group = item.group || "명령";
            if (!groups[group]) groups[group] = [];
            groups[group].push(item);
        });
        return groups;
    }, [filtered]);

    const flatList = useMemo(() => {
        return Object.values(grouped).flat();
    }, [grouped]);

    const close = useCallback(() => {
        setOpen(false);
        setQuery("");
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            close();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, flatList.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && flatList[activeIndex]) {
            e.preventDefault();
            flatList[activeIndex].onSelect();
            close();
        }
    };

    useEffect(() => {
        if (!listRef.current) return;
        const active = listRef.current.querySelector("[data-active='true']");
        active?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    if (!open) return null;

    let itemIndex = 0;

    return (
        <div
            className="fixed inset-0 z-100 flex items-start justify-center pt-[20vh] bg-black/50 animate-in fade-in duration-100"
            onClick={close}
        >
            <div
                className={cn(
                    "w-full max-w-lg rounded-xl overflow-hidden",
                    "bg-(--color-bg-secondary) border border-(--color-border)",
                    "shadow-(--shadow-elevated)",
                    "animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150",
                )}
                onClick={(e) => e.stopPropagation()}
            >
                
                <div className="flex items-center gap-3 px-4 h-12 border-b border-(--color-border)">
                    <Search className="w-4 h-4 text-(--color-icon-secondary) shrink-0" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setActiveIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="flex-1 bg-transparent text-[14px] text-(--color-text-primary) placeholder:text-(--color-text-disabled) focus:outline-none"
                    />
                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-(--color-border) bg-(--color-bg-tertiary)">
                        <span className="text-[10px] text-(--color-text-tertiary) font-bold uppercase tracking-tighter">Esc</span>
                    </div>
                </div>

                <div ref={listRef} className="max-h-[360px] overflow-y-auto p-1.5 custom-scrollbar">
                    {flatList.length === 0 ? (
                        <div className="py-12 text-center space-y-2">
                             <Search className="w-8 h-8 text-(--color-icon-tertiary) mx-auto opacity-20" />
                             <p className="text-[13px] text-(--color-text-tertiary)">
                                No results found for <span className="text-(--color-text-primary) font-semibold">"{query}"</span>
                            </p>
                        </div>
                    ) : (
                        Object.entries(grouped).map(([group, groupItems]) => (
                            <div key={group} className="mb-2 last:mb-0">
                                <div className="px-3 py-2 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-widest opacity-60">
                                    {group}
                                </div>
                                <div className="space-y-0.5">
                                    {groupItems.map((item) => {
                                        const idx = itemIndex++;
                                        const isActive = idx === activeIndex;
                                        return (
                                            <button
                                                key={item.id}
                                                data-active={isActive}
                                                onClick={() => {
                                                    item.onSelect();
                                                    close();
                                                }}
                                                onMouseEnter={() => setActiveIndex(idx)}
                                                className={cn(
                                                    "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13.5px] transition-all duration-75 group/item",
                                                    isActive
                                                        ? "bg-(--color-bg-hover) text-(--color-text-primary) shadow-sm"
                                                        : "text-(--color-text-secondary) hover:text-(--color-text-primary)",
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-5 h-5 flex items-center justify-center rounded shrink-0 transition-colors",
                                                    isActive ? "text-(--color-text-primary)" : "text-(--color-icon-secondary) group-hover/item:text-(--color-text-primary)"
                                                )}>
                                                    {item.icon ? (
                                                        <span className="[&>svg]:w-4 [&>svg]:h-4">
                                                            {item.icon}
                                                        </span>
                                                    ) : (
                                                        <Hash className="w-3.5 h-3.5 opacity-40" />
                                                    )}
                                                </div>
                                                <span className="flex-1 text-left truncate font-medium">{item.label}</span>
                                                {item.shortcut && (
                                                    <div className="flex gap-1 shrink-0 opacity-40 group-hover/item:opacity-100 transition-opacity">
                                                        {item.shortcut.map((key, i) => (
                                                            <div key={i} className="min-w-[18px] h-5 flex items-center justify-center px-1 rounded border border-(--color-border) bg-(--color-bg-secondary) text-[10px] font-bold text-(--color-text-tertiary)">
                                                                {key}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer hints */}
                <div className="h-10 px-4 border-t border-(--color-border) bg-(--color-bg-primary)/50 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 flex items-center justify-center rounded border border-(--color-border) bg-(--color-bg-secondary) text-[9px] font-bold text-(--color-text-tertiary)">
                                ↑
                            </div>
                            <div className="w-4 h-4 flex items-center justify-center rounded border border-(--color-border) bg-(--color-bg-secondary) text-[9px] font-bold text-(--color-text-tertiary)">
                                ↓
                            </div>
                            <span className="text-[11px] text-(--color-text-tertiary)">Navigate</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="px-1 h-4 flex items-center justify-center rounded border border-(--color-border) bg-(--color-bg-secondary) text-[9px] font-bold text-(--color-text-tertiary)">
                                ↵
                            </div>
                            <span className="text-[11px] text-(--color-text-tertiary)">Select</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-(--color-text-disabled)">
                        <span className="w-1 h-1 rounded-full bg-green-500/50" />
                        Command Bar v2.1
                    </div>
                </div>
            </div>
        </div>
    );
}

export function useDefaultCommands(): CommandItem[] {
    return useMemo(() => [
        {
            id: "new-lead",
            label: "새 리드 추가",
            icon: <Plus />,
            shortcut: ["C"],
            group: "액션",
            onSelect: () => console.log("새 리드 추가"),
        },
        {
            id: "leads",
            label: "리드 목록",
            icon: <Users />,
            shortcut: ["G", "L"],
            group: "이동",
            onSelect: () => console.log("리드 목록으로 이동"),
        },
        {
            id: "settings",
            label: "설정",
            icon: <Settings />,
            shortcut: ["G", "S"],
            group: "이동",
            onSelect: () => console.log("설정으로 이동"),
        },
    ], []);
}
