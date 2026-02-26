
import { MessageSquare, Bell, ChevronRight, User } from "lucide-react";
import { cn } from "@/utils/util";

export type InboxType = "MESSAGE" | "NOTICE";

interface InboxCardProps {
    type: InboxType;
    sender: string;
    title: string;
    content?: string;
    date: string;
    isRead?: boolean;
    isSelected?: boolean;
    priority?: "HIGH" | "MEDIUM" | "LOW";
    onClick?: () => void;
}

/**
 * InboxCard Component
 * Follows Linear design philosophy: Minimalist yet clear.
 * Uses semantic tokens from globals.css for consistent LCH-based coloring.
 */
export function InboxCard({
    type,
    sender,
    title,
    content,
    date,
    isRead = false,
    isSelected = false,
    priority,
    onClick,
}: InboxCardProps) {
    const Icon = type === "MESSAGE" ? MessageSquare : Bell;

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex flex-col items-start px-5 py-4 text-left transition-all border-b border-(--color-border) group relative outline-none",
                isSelected
                    ? "bg-(--color-bg-active)"
                    : "bg-transparent hover:bg-(--color-bg-hover)"
            )}
        >
            {/* Left border active indicator */}
            {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-(--color-accent) z-10" />
            )}

            <div className="w-full flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn(
                        "flex items-center justify-center w-5 h-5 rounded-md shrink-0",
                        type === "NOTICE" 
                            ? "bg-blue-500/10 text-blue-500" 
                            : "bg-(--color-accent-muted) text-(--color-accent)"
                    )}>
                        <Icon className="w-3 h-3" />
                    </div>
                    <span className={cn(
                        "text-[12px] font-bold uppercase tracking-widest truncate",
                        isRead ? "text-(--color-text-tertiary)" : "text-(--color-text-primary)"
                    )}>
                        {sender}
                    </span>
                    
                    {/* Priority Dot */}
                    {priority === "HIGH" && (
                        <div className="w-1 h-1 rounded-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]" />
                    )}
                </div>
                <span className="text-[11px] text-(--color-text-tertiary) tabular-nums font-medium whitespace-nowrap">
                    {date}
                </span>
            </div>

            <div className="space-y-1 w-full pl-7">
                <h3 className={cn(
                    "text-[13.5px] font-bold leading-snug tracking-tight truncate",
                    isRead ? "text-(--color-text-secondary)" : "text-(--color-text-primary)"
                )}>
                    {title}
                </h3>
                {content && (
                    <p className="text-[12px] leading-relaxed text-(--color-text-tertiary) line-clamp-2">
                        {content}
                    </p>
                )}
            </div>

            {/* Read/Unread Status Dot */}
            {!isRead && (
                <div className="absolute top-[42px] left-[14px] w-1.5 h-1.5 rounded-full bg-(--color-accent) shadow-[0_0_8px_var(--color-accent)]" />
            )}
            
            <ChevronRight className={cn(
                "absolute bottom-4 right-3 w-3.5 h-3.5 text-(--color-text-disabled) transition-all duration-200",
                isSelected ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 text-(--color-text-tertiary)"
            )} />
        </button>
    );
}
