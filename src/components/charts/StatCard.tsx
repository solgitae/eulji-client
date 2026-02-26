import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { cn } from "@/utils/util";

interface StatCardProps {
    label: string;
    value: string | number;
    trend?: number;
    trendLabel?: string;
    sparkData?: { v: number }[];
    icon?: React.ReactNode;
    className?: string;
}

export function StatCard({ label, value, trend, trendLabel, sparkData, icon, className }: StatCardProps) {
    const hasTrend = typeof trend === 'number';
    const isUp = hasTrend && trend > 0;
    const isDown = hasTrend && trend < 0;

    return (
        <div className={cn("flex flex-col gap-4 rounded-lg p-6 bg-(--color-bg-secondary) border border-(--color-border)", className)}>
            <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-(--color-text-tertiary)">{label}</span>
                {icon && <span className="text-(--color-icon-secondary)">{icon}</span>}
            </div>
            <div className="flex items-end justify-between gap-3 mt-1">
                <span className="text-[32px] font-bold text-(--color-text-primary) leading-none tabular-nums tracking-tight">
                    {value}
                </span>

                {sparkData && sparkData.length > 0 && (
                    <div className="w-20 h-8 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparkData}>
                                <Line type="monotone" dataKey="v" stroke="var(--color-chart-1)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
            {hasTrend && (
                <div className="flex items-center gap-1.5 text-[12px] font-normal text-(--color-text-tertiary) mt-1">
                    {isUp && <TrendingUp className="w-3.5 h-3.5" />}
                    {isDown && <TrendingDown className="w-3.5 h-3.5" />}
                    {!isUp && !isDown && <Minus className="w-3.5 h-3.5" />}
                    <span>{isUp && trend > 0 ? "+" : ""}{trend}% {trendLabel || "전월 대비"}</span>
                </div>
            )}
        </div>
    );
}
