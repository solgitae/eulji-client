import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/utils/util";

import { EmptyState } from "./EmptyState";

export interface AreaSeries { key: string; label: string; colorVar: string; }
export interface AreaDataPoint { date: string; [key: string]: number | string; }

function getColor(colorVar: string) {
    if (typeof window === 'undefined') return '#888';
    return getComputedStyle(document.documentElement).getPropertyValue(colorVar).trim();
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg px-3 py-2 text-[13px] min-w-[120px]" style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-elevated)" }}>
            <p className="text-(--color-text-tertiary) mb-1.5">{label}</p>
            {payload.map((p: any) => (
                <div key={p.dataKey} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                        <span className="text-(--color-text-secondary)">{p.name}</span>
                    </div>
                    <span className="font-semibold text-(--color-text-primary) tabular-nums">{p.value}</span>
                </div>
            ))}
        </div>
    );
}

interface LeadAreaChartProps { title: string; data: AreaDataPoint[]; series: AreaSeries[]; className?: string; }

export function LeadAreaChart({ title, data, series, className }: LeadAreaChartProps) {
    const totalSum = data.reduce((sum, d) => {
        let daySum = 0;
        series.forEach(s => {
            daySum += Number(d[s.key] || 0);
        });
        return sum + daySum;
    }, 0);
    const isEmpty = totalSum === 0;

    return (
        <div className={cn("rounded-lg border border-(--color-border) bg-(--color-bg-secondary) p-6 flex flex-col", className)}>
            <span className="text-[14px] font-semibold text-(--color-text-primary) mb-4">{title}</span>
            <div className="h-[160px] w-full relative">
                {isEmpty ? (
                    <EmptyState message="최근 7개월 데이터가 없습니다" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                            <defs>
                                {series.map((s) => {
                                    const color = getColor(s.colorVar);
                                    return (
                                        <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
                                            <stop offset="100%" stopColor={color} stopOpacity={0} />
                                        </linearGradient>
                                    );
                                })}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--color-chart-axis)" }} axisLine={false} tickLine={false} dy={4} />
                            <YAxis tick={{ fontSize: 10, fill: "var(--color-chart-axis)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--color-border-strong)", strokeWidth: 1 }} />
                            {series.map((s) => {
                                const color = getColor(s.colorVar);
                                return (
                                    <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={color} strokeWidth={1.5} fill={`url(#grad-${s.key})`} dot={false} isAnimationActive={false} />
                                );
                            })}
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
            {!isEmpty && (
                <div className="flex items-center gap-4 flex-wrap mt-4">
                    {series.map((s) => {
                        const color = getColor(s.colorVar);
                        return (
                            <div key={s.key} className="flex items-center gap-1.5">
                                <span className="w-2.5 h-0.5 rounded-full" style={{ background: color }} />
                                <span className="text-[13px] text-(--color-text-tertiary)">{s.label}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
