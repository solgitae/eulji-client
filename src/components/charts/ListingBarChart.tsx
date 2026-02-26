import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { cn } from "@/utils/util";

import { EmptyDonut } from "./EmptyState";

export interface BarDataPoint { label: string; value: number; colorVar?: string; }

function getColor(colorVar?: string) {
    if (typeof window === 'undefined') return '#6366f1';
    return getComputedStyle(document.documentElement).getPropertyValue(colorVar ?? '--color-chart-1').trim();
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg px-3 py-2 text-[13px]" style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-elevated)" }}>
            <span className="text-(--color-text-secondary)">{label}　</span>
            <span className="font-semibold text-(--color-text-primary) tabular-nums">{payload[0].value}건</span>
        </div>
    );
}

interface ListingBarChartProps { title: string; data: BarDataPoint[]; className?: string; }

export function ListingBarChart({ title, data, className }: ListingBarChartProps) {
    const totalSum = data.reduce((sum, d) => sum + d.value, 0);
    const isEmpty = totalSum === 0;

    return (
        <div className={cn("rounded-lg border border-(--color-border) bg-(--color-bg-secondary) p-6 flex flex-col", className)}>
            <span className="text-[14px] font-semibold text-(--color-text-primary) mb-4">{title}</span>
            <div className="h-[160px] w-full flex items-center justify-center">
                {isEmpty ? (
                    <EmptyDonut message="데이터 없음" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }} barCategoryGap="35%">
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" vertical={false} />
                            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--color-chart-axis)" }} axisLine={false} tickLine={false} dy={4} />
                            <YAxis tick={{ fontSize: 10, fill: "var(--color-chart-axis)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-bg-active)", radius: 4 }} />
                            <Bar dataKey="value" radius={[3, 3, 0, 0]} isAnimationActive={false}>
                                {data.map((entry, idx) => <Cell key={idx} fill={getColor(entry.colorVar)} fillOpacity={0.85} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
