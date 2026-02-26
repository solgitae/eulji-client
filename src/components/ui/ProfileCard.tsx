
import React from "react";
import { cn } from "@/utils/util";
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, User } from "lucide-react";

/**
 * ProfileCard Component
 * High-fidelity Linear-style card for assessing freelancers/clients.
 * Focuses on rapid information density (Risk, Strength, Scale).
 */

export interface ProfileCardProps {
    name: string;
    role: string; // e.g., "Backend · Payments · B2B SaaS"
    avatarUrl?: string;
    riskLabel: string;    // e.g., "리스크 Low"
    trustLabel: string;   // e.g., "신뢰도 High"
    metrics: {
        completedProjects: number;
        avgResponseHours: number; // e.g., 1.2
        avgDealSizeMillion: number; // e.g., 7.3 (in millions)
        renewalRatePercent: number; // e.g., 68
    };
    styleIndex: {
        scopeDiscipline: 0 | 1 | 2 | 3 | 4;
        communication: 0 | 1 | 2 | 3 | 4;
        deadlineReliability: 0 | 1 | 2 | 3 | 4;
    };
    activitySnippets: string[]; // Length 2-3 short sentences
    onClick?: () => void;
}

export function ProfileCard({
    name,
    role,
    avatarUrl,
    riskLabel,
    trustLabel,
    metrics,
    styleIndex,
    activitySnippets,
    onClick,
}: ProfileCardProps) {
    const MetricItem = ({ value, label, suffix = "" }: { value: string | number; label: string; suffix?: string }) => (
        <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[15px] font-bold text-(--color-text-primary) font-mono tabular-nums truncate">
                {value}{suffix}
            </span>
            <span className="text-[11px] text-(--color-text-tertiary) truncate">
                {label}
            </span>
        </div>
    );

    const DotBar = ({ label, value }: { label: string; value: number }) => (
        <div className="flex items-center justify-between group/row">
            <span className="text-[12px] text-(--color-text-secondary) font-medium">{label}</span>
            <div className="flex gap-1.5">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            "w-4 h-1 rounded-full transition-colors duration-300",
                            i < value 
                                ? "bg-(--color-accent)" 
                                : "bg-white/10 group-hover/row:bg-white/20"
                        )}
                    />
                ))}
            </div>
        </div>
    );

    const ActivityItem = ({ text, type }: { text: string; type: number }) => {
        const icons = [
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500/80" />,
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500/80" />,
            <Clock className="w-3.5 h-3.5 text-amber-500/80" />
        ];
        return (
            <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0 opacity-70">
                    {icons[type % 3]}
                </div>
                <p className="text-[11.5px] text-(--color-text-secondary) leading-tight line-clamp-2">
                    {text}
                </p>
            </div>
        );
    };

    return (
        <div
            role={onClick ? "button" : "presentation"}
            onClick={onClick}
            className={cn(
                "group relative w-[340px] flex flex-col gap-5 p-5 transition-all duration-200 ease-out select-none",
                "bg-gradient-to-b from-[#111118] to-[#050509] rounded-xl border border-white/[0.04]",
                "shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]",
                "hover:scale-[1.01] hover:border-white/[0.08]",
                onClick ? "cursor-pointer" : "cursor-default"
            )}
        >
            {/* Header Action Icon */}
            {onClick && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                    <ArrowRight className="w-4 h-4 text-(--color-text-tertiary)" />
                </div>
            )}

            {/* 1. Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-[32px] h-[32px] rounded-full border border-white/10 overflow-hidden bg-(--color-bg-tertiary) flex items-center justify-center shrink-0 shadow-inner">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-(--color-text-tertiary)" />
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <h3 className="text-[15px] font-bold text-(--color-text-primary) tracking-tight truncate">
                            {name}
                        </h3>
                        <p className="text-[11.5px] text-(--color-text-tertiary) truncate font-medium">
                            {role}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold tracking-tight">
                        {riskLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] font-bold tracking-tight">
                        {trustLabel}
                    </span>
                </div>
            </div>

            {/* 2. Metrics Strip */}
            <div className="grid grid-cols-4 gap-2 py-3 px-4 rounded-lg bg-white/[0.02] border border-white/[0.03] relative">
                <MetricItem value={metrics.completedProjects} label="완료 프로젝트" />
                <div className="absolute left-[25%] top-[25%] bottom-[25%] w-px bg-white/[0.05]" />
                <MetricItem value={metrics.avgResponseHours.toFixed(1)} label="평균 응답시간" suffix="h" />
                <div className="absolute left-[50%] top-[25%] bottom-[25%] w-px bg-white/[0.05]" />
                <MetricItem value={metrics.avgDealSizeMillion.toFixed(1)} label="평균 딜 사이즈" suffix="M" />
                <div className="absolute left-[75%] top-[25%] bottom-[25%] w-px bg-white/[0.05]" />
                <MetricItem value={metrics.renewalRatePercent} label="재계약률" suffix="%" />
            </div>

            {/* 3. Style Index */}
            <div className="space-y-3 px-1">
                <DotBar label="스코프 관리" value={styleIndex.scopeDiscipline} />
                <DotBar label="커뮤니케이션" value={styleIndex.communication} />
                <DotBar label="마감 준수" value={styleIndex.deadlineReliability} />
            </div>

            {/* 4. Activity Snippets */}
            <div className="space-y-2.5 pt-2 border-t border-white/[0.05]">
                {activitySnippets.map((snippet, i) => (
                    <ActivityItem key={i} text={snippet} type={i} />
                ))}
            </div>
        </div>
    );
}
