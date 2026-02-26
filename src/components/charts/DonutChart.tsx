import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/utils/util";

import { EmptyDonut } from "./EmptyState";

export interface DonutSlice { key: string; label: string; value: number; colorVar: string; }

/** CSS 변수 값을 클라이언트에서만 읽는 훅 — SSR/hydration mismatch 방지 */
function useResolvedColors(data: DonutSlice[]): (colorVar: string) => string {
    const [colors, setColors] = useState<Record<string, string>>({});

    useEffect(() => {
        const style = getComputedStyle(document.documentElement);
        const resolved: Record<string, string> = {};
        for (const d of data) {
            resolved[d.colorVar] = style.getPropertyValue(d.colorVar).trim() || "#888";
        }
        setColors(resolved);
    // data의 colorVar 목록이 바뀔 때만 재계산
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.map((d) => d.colorVar).join(",")]);

    return (colorVar: string) => colors[colorVar] ?? "#888";
}

function CustomTooltip({ active, payload, getColor }: any) {
    if (!active || !payload?.length) return null;
    const d: DonutSlice = payload[0].payload;
    return (
        <div className="rounded-lg px-3 py-2 text-[13px]" style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-elevated)" }}>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: getColor(d.colorVar) }} />
                <span className="text-(--color-text-secondary)">{d.label}</span>
                <span className="font-semibold text-(--color-text-primary) ml-1">{d.value}건</span>
            </div>
        </div>
    );
}

interface DonutChartProps { title: string; data: DonutSlice[]; total?: number; centerLabel?: string; className?: string; }

export function DonutChart({ title, data, total, centerLabel, className }: DonutChartProps) {
    const displayTotal = total ?? data.reduce((s, d) => s + d.value, 0);
    const isEmpty = displayTotal === 0;
    const getColor = useResolvedColors(data);

    return (
        <div className={cn("rounded-lg border border-(--color-border) bg-(--color-bg-secondary) p-6 flex flex-col", className)}>
            <span className="text-[14px] font-semibold text-(--color-text-primary) mb-4">{title}</span>
            <div className="flex items-center gap-6">
                {isEmpty ? (
                    <EmptyDonut message="데이터 없음" />
                ) : (
                    <div className="relative shrink-0 w-[110px] h-[110px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50} startAngle={90} endAngle={-270} strokeWidth={0} isAnimationActive={false}>
                                    {data.map((entry) => <Cell key={entry.key} fill={getColor(entry.colorVar)} />)}
                                </Pie>
                                <Tooltip content={(props: any) => <CustomTooltip {...props} getColor={getColor} />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-lg font-semibold text-(--color-text-primary) leading-none tabular-nums">{displayTotal}</span>
                            <span className="text-[10px] text-(--color-text-tertiary) mt-0.5">{centerLabel ?? "전체"}</span>
                        </div>
                    </div>
                )}
                
                <ul className="flex flex-col gap-2 flex-1 min-w-0">
                    {data.map((entry) => {
                        const pct = displayTotal > 0 ? Math.round((entry.value / displayTotal) * 100) : 0;
                        return (
                            <li key={entry.key} className="flex items-center gap-2 min-w-0 text-[13px] text-(--color-text-tertiary)">
                                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: getColor(entry.colorVar) }} />
                                <span className="truncate flex-1">{entry.label}</span>
                                <span className="font-medium tabular-nums shrink-0">{entry.value}</span>
                                {!isEmpty && <span className="shrink-0 w-8 text-right tabular-nums">{pct}%</span>}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}
